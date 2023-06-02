export interface MintStage {
  name: string;
  startTime: Date;
  endTime: Date;
  type: 'ALLOWLIST' | 'PUBLIC';
  price: string;
}
