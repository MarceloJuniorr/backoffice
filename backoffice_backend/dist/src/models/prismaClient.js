"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
// Inicializa o Prisma Client
const prisma = new client_1.PrismaClient();
exports.default = prisma;
