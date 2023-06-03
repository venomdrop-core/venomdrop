export interface MintStage {
  name: string;
  startTime: Date;
  endTime: Date;
  price: string;
  type: 'ALLOWLIST' | 'PUBLIC';
  allowlist?: string[];
}
