/**
 * IRepository — Generic repository contract (OCP: open for extension, closed for modification)
 * All concrete repositories implement this interface — Liskov Substitution holds.
 */
export interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  findAll(filter?: object): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}
