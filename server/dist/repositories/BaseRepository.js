"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
/**
 * BaseRepository<T> — OCP: open for extension via subclassing, closed for modification.
 * Liskov: every subclass can replace BaseRepository<T> without breaking behavior.
 */
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async findById(id) {
        return this.model.findById(id).exec();
    }
    async findAll(filter = {}) {
        return this.model.find(filter).exec();
    }
    async create(data) {
        return this.model.create(data);
    }
    async update(id, data) {
        return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    }
    async delete(id) {
        const result = await this.model.findByIdAndDelete(id).exec();
        return !!result;
    }
}
exports.BaseRepository = BaseRepository;
//# sourceMappingURL=BaseRepository.js.map