export function restoreFlightsCapacity(flights: any[], aircrafts: any[]): any[];
export function applySyncAction(
  currentStore: Record<string, any>,
  action: { id?: string; type: string; payload?: any }
): { state: Record<string, any>; mutated: boolean };
