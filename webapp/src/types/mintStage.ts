export interface MintStage {
  name: string;
  startTime: Date;
  endTime: Date;
  type: 'public' | 'allowlist';
  price: string;
}
