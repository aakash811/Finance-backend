"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserStatus = exports.RecordType = exports.Role = void 0;
var Role;
(function (Role) {
    Role["VIEWER"] = "VIEWER";
    Role["ANALYST"] = "ANALYST";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var RecordType;
(function (RecordType) {
    RecordType["INCOME"] = "INCOME";
    RecordType["EXPENSE"] = "EXPENSE";
})(RecordType || (exports.RecordType = RecordType = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
})(UserStatus || (exports.UserStatus = UserStatus = {}));
//# sourceMappingURL=index.js.map