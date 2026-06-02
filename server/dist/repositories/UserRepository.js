"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const BaseRepository_1 = require("./BaseRepository");
const User_model_1 = require("../models/User.model");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(User_model_1.UserModel);
    }
    /** Domain-specific query — finds user with password field included */
    async findByEmail(email, withPassword = false) {
        const query = this.model.findOne({ email });
        return withPassword ? query.select('+password').exec() : query.exec();
    }
    /** Fetch all users without password, newest first */
    async findAllWithoutPassword() {
        return this.model.find({}).select('-password').sort({ createdAt: -1 }).exec();
    }
    async countByRole(role) {
        return this.model.countDocuments({ role });
    }
    async countAll() {
        return this.model.countDocuments({});
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map