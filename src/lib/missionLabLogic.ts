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
