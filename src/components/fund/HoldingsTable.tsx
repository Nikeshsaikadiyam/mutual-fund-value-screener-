'use client';

import React from 'react';
import { TopHolding } from '@/types/fund';
import { TopHoldingsTable } from '@/components/fund/TopHoldingsTable';

interface HoldingsTableProps {
  holdings?: TopHolding[] | null;
  sectorAllocation?: { sector: string; percentage: number }[] | null;
  schemeName?: string;
}

export const HoldingsTable: React.FC<HoldingsTableProps> = (props) => {
  return <TopHoldingsTable {...props} />;
};

export { TopHoldingsTable };
