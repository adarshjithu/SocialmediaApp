"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAdmin = void 0;
const adminModel_1 = require("../Models/adminModel");
const password_1 = require("./password");
const createAdmin = (admin) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const password = yield (0, password_1.hashPassword)(admin.password);
        admin.password = password;
        yield adminModel_1.Admin.create(admin);
    }
    catch (error) {
        console.log(error);
    }
});
exports.createAdmin = createAdmin;
