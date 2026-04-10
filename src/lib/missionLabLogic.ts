import type { MissionLabDefinition, MissionLabObjective } from '../data/missionLabs';

export type CellMap = Record<string, string>;

export function buildBaseCells(lab: MissionLabDefinition): CellMap {
  const cells: CellMap = {};

  lab.rows.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      const cellId = `${lab.columns[columnIndex]}${rowIndex + 1}`;
      cells[cellId] = value;
    });
  });

  return cells;
}

export function canonicalizeFormula(value: string) {
  return value.replace(/\s+/g, '').replace(/;/g, ',').toUpperCase();
}

function extractFormulaFunction(formula: string) {
  const normalized = canonicalizeFormula(formula);
  const match = normalized.match(/^=([A-Z.]+)\(/);
  return match ? match[1] : null;
}

function extractCellReferences(formula: string) {
  const normalized = canonicalizeFormula(formula);
  const matches = normalized.match(/[A-Z]+\d+(?::[A-Z]+\d+)?/g);
  return matches ?? ([] as string[]);
}

function parseScalarToken(token: string, cells: CellMap, visited: Set<string>) {
  const normalized = token.trim().toUpperCase();

  if (/^[A-Z]+\d+$/.test(normalized)) {
    const evaluated = evaluateCellFormula(normalized, cells, new Set(visited));
    const asNumber = Number(evaluated);
    return Number.isNaN(asNumber) ? evaluated : asNumber;
  }

  if (/^-?\d+(\.\d+)?$/.test(normalized)) {
    return Number(normalized);
  }

  return normalized.replace(/^"|"$/g, '');
}

function evaluateBinaryExpression(formulaBody: string, cells: CellMap, visited: Set<string>): string | null {
  const binaryMatch = formulaBody.match(/^([A-Z]+\d+|-?\d+(?:\.\d+)?)([+\-*/])([A-Z]+\d+|-?\d+(?:\.\d+)?)$/);
  if (!binaryMatch) {
    return null;
  }

  const [, leftRaw, operator, rightRaw] = binaryMatch;
  const left = Number(parseScalarToken(leftRaw, cells, visited));
  const right = Number(parseScalarToken(rightRaw, cells, visited));

  if (Number.isNaN(left) || Number.isNaN(right)) {
    return '#VALUE!';
  }

  const result =
    operator === '+'
      ? left + right
      : operator === '-'
        ? left - right
        : operator === '*'
          ? left * right
          : right === 0
            ? NaN
            : left / right;

  return Number.isNaN(result) ? '#DIV/0!' : String(result);
}

export function readRange(range: string, cells: CellMap, visited: Set<string>) {
  const [start, end] = range.split(':');
  const startColumn = start[0];
  const endColumn = end[0];
  const startRow = Number(start.slice(1));
  const endRow = Number(end.slice(1));
  const values: string[] = [];

  for (let columnCode = startColumn.charCodeAt(0); columnCode <= endColumn.charCodeAt(0); columnCode += 1) {
    for (let row = startRow; row <= endRow; row += 1) {
      values.push(evaluateCellFormula(`${String.fromCharCode(columnCode)}${row}`, cells, new Set(visited)));
    }
  }

  return values;
}

export function evaluateCellFormula(cellId: string, cells: CellMap, visited = new Set<string>()): string {
  if (visited.has(cellId)) {
    return '#LOOP!';
  }

  const raw = cells[cellId] ?? '';
  if (!raw.startsWith('=')) {
    return raw;
  }

  visited.add(cellId);
  const formula = canonicalizeFormula(raw);
  const formulaBody = formula.slice(1);

  if (/^[A-Z]+\d+$/.test(formulaBody)) {
    return evaluateCellFormula(formulaBody, cells, new Set(visited));
  }

  const binaryExpression = evaluateBinaryExpression(formulaBody, cells, visited);
  if (binaryExpression !== null) {
    return binaryExpression;
  }

  const sumMatch = formula.match(/^=SUM\(([A-Z]\d+:[A-Z]\d+)\)$/);
  if (sumMatch) {
    const values = readRange(sumMatch[1], cells, visited).map((value) => Number(value) || 0);
    return String(values.reduce((total, value) => total + value, 0));
  }

  const averageMatch = formula.match(/^=AVERAGE\(([A-Z]\d+:[A-Z]\d+)\)$/);
  if (averageMatch) {
    const values = readRange(averageMatch[1], cells, visited).map((value) => Number(value) || 0);
    return String(values.reduce((total, value) => total + value, 0) / values.length);
  }

  const maxMatch = formula.match(/^=MAX\(([A-Z]\d+:[A-Z]\d+)\)$/);
  if (maxMatch) {
    const values = readRange(maxMatch[1], cells, visited).map((value) => Number(value) || 0);
    return String(Math.max(...values));
  }

  const minMatch = formula.match(/^=MIN\(([A-Z]\d+:[A-Z]\d+)\)$/);
  if (minMatch) {
    const values = readRange(minMatch[1], cells, visited).map((value) => Number(value) || 0);
    return String(Math.min(...values));
  }

  const countIfMatch = formula.match(/^=COUNTIF\(([A-Z]\d+:[A-Z]\d+),"(.*)"\)$/);
  if (countIfMatch) {
    const [, criteriaRange, criterion] = countIfMatch;
    const values = readRange(criteriaRange, cells, visited);
    return String(values.filter((value) => value === criterion).length);
  }

  const sumIfMatch = formula.match(/^=SUMIF\(([A-Z]\d+:[A-Z]\d+),"(.*)",([A-Z]\d+:[A-Z]\d+)\)$/);
  if (sumIfMatch) {
    const [, criteriaRange, criterion, sumRange] = sumIfMatch;
    const criteriaValues = readRange(criteriaRange, cells, visited);
    const sumValues = readRange(sumRange, cells, visited).map((value) => Number(value) || 0);
    const result = criteriaValues.reduce((total, value, index) => (value === criterion ? total + sumValues[index] : total), 0);
    return String(result);
  }

  const xlookupMatch = formula.match(/^=XLOOKUP\("?(.*?)"?,([A-Z]\d+:[A-Z]\d+),([A-Z]\d+:[A-Z]\d+)\)$/);
  if (xlookupMatch) {
    const [, lookupValue, lookupRange, returnRange] = xlookupMatch;
    const lookupValues = readRange(lookupRange, cells, visited);
    const returnValues = readRange(returnRange, cells, visited);
    const index = lookupValues.findIndex((value) => value === lookupValue);
    return index >= 0 ? returnValues[index] : '#N/A';
  }

  const ifMatch = formula.match(/^=IF\(([A-Z]\d+)(>=|<=|>|<|=)(-?\d+(?:\.\d+)?),"([^"]*)","([^"]*)"\)$/);
  if (ifMatch) {
    const [, leftRef, operator, rightRaw, whenTrue, whenFalse] = ifMatch;
    const leftValue = Number(evaluateCellFormula(leftRef, cells, visited));
    const rightValue = Number(rightRaw);
    const isTrue =
      operator === '>='
        ? leftValue >= rightValue
        : operator === '<='
          ? leftValue <= rightValue
          : operator === '>'
            ? leftValue > rightValue
            : operator === '<'
              ? leftValue < rightValue
              : leftValue === rightValue;

    return isTrue ? whenTrue : whenFalse;
  }

  return '#N/A';
}

export function matchesObjective(objective: MissionLabObjective, cells: CellMap) {
  const value = cells[objective.cellId] ?? '';
  if (objective.expectedValue !== undefined) {
    return value.trim().toLowerCase() === objective.expectedValue.trim().toLowerCase();
  }

  if (objective.expectedFormula) {
    return canonicalizeFormula(value) === canonicalizeFormula(objective.expectedFormula);
  }

  return false;
}

export function getObjectiveFeedback(objective: MissionLabObjective, cells: CellMap) {
  const value = cells[objective.cellId] ?? '';

  if (matchesObjective(objective, cells)) {
    return {
      state: 'complete' as const,
      category: 'correct' as const,
      label: 'Completato',
      message: 'Questo passaggio è corretto. Puoi continuare con lo step successivo.',
    };
  }

  if (!value.trim()) {
    return {
      state: 'empty' as const,
      category: 'missing-input' as const,
      label: 'Da iniziare',
      message: objective.expectedFormula
        ? `Inserisci una formula in ${objective.cellId} per completare questo step.`
        : `Inserisci il valore corretto in ${objective.cellId} per completare questo step.`,
    };
  }

  if (objective.expectedFormula) {
    if (!value.trim().startsWith('=')) {
      return {
        state: 'warning' as const,
        category: 'missing-formula' as const,
        label: 'Formula mancante',
        message: `Qui serve una formula, non solo un valore statico. Parti con "=" e costruisci la logica richiesta.`,
      };
    }

    const expectedFunction = extractFormulaFunction(objective.expectedFormula);
    const actualFunction = extractFormulaFunction(value);
    if (expectedFunction && actualFunction && expectedFunction !== actualFunction) {
      return {
        state: 'warning' as const,
        category: 'wrong-function' as const,
        label: 'Funzione sbagliata',
        message: `La formula usa ${actualFunction}, ma qui stiamo allenando ${expectedFunction}. Rivedi la funzione principale.`,
      };
    }

    const expectedRefs = extractCellReferences(objective.expectedFormula);
    const actualRefs = extractCellReferences(value);
    if (
      expectedRefs.length > 0 &&
      actualRefs.length > 0 &&
      expectedRefs.some((reference) => !actualRefs.includes(reference))
    ) {
      return {
        state: 'warning' as const,
        category: 'wrong-reference' as const,
        label: 'Range o riferimento errato',
        message: 'La logica è vicina, ma uno o più riferimenti non puntano alle celle corrette. Controlla range, chiavi e colonne di ritorno.',
      };
    }

    const expectedResult = evaluateCellFormula('__expected__', { ...cells, __expected__: objective.expectedFormula });
    const actualResult = evaluateCellFormula(objective.cellId, cells);

    if (actualResult === expectedResult) {
      return {
        state: 'warning' as const,
        category: 'right-result-wrong-structure' as const,
        label: 'Risultato corretto',
        message: 'Il risultato finale torna, ma qui stiamo allenando una formula specifica. Rivedi struttura, range e funzione usata.',
      };
    }

    if (actualResult === '#N/A' || actualResult === '#VALUE!' || actualResult === '#DIV/0!' || actualResult === '#LOOP!') {
      return {
        state: 'warning' as const,
        category: 'formula-error' as const,
        label: 'Errore di formula',
        message: `La formula restituisce ${actualResult}. Controlla sintassi, riferimenti e ordine degli argomenti.`,
      };
    }

    return {
      state: 'warning' as const,
      category: 'wrong-output' as const,
      label: 'Da correggere',
      message: objective.hintPrimary,
    };
  }

  return {
    state: 'warning' as const,
    category: 'wrong-value' as const,
    label: 'Da correggere',
    message: objective.hintPrimary,
  };
}
