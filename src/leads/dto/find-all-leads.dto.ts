export type LeadSort = 'alphabetical' | 'recent' | 'oldest';

export class FindAllLeadsDto {
  sort?: LeadSort;
}
