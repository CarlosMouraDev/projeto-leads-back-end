import { Handler } from "express";
import { prisma } from "../database";
import {
  CreateLeadRequestSchema,
  GetLeadsRequestSchema,
  UpdateLeadRequestSchema,
} from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";
import { Prisma } from "@prisma/client";

export class LeadsController {
  // GET /leads
  index: Handler = async (req, res, next) => {
    try {
      const query = GetLeadsRequestSchema.parse(req.query);
      const {
        page = "1",
        pageSize = "10",
        name,
        status,
        sortBy = "name",
        order = "asc",
      } = query;

      const pageNumber = Number(page);
      const pageSizeNumber = Number(pageSize);

      const where: Prisma.LeadWhereInput = {};

      if (name) where.name = { contains: name, mode: "insensitive" };
      if (status) where.status = status;

      const leads = await prisma.lead.findMany({
        where,
        skip: (pageNumber - 1) * pageSizeNumber,
        take: pageSizeNumber,
        orderBy: {
          [sortBy]: order,
        },
      });

      const total = await prisma.lead.count({ where });
      res.status(201).json({
        data: leads,
        meta: {
          page: pageNumber,
          pageSize: pageSizeNumber,
          total,
          totalPages: Math.ceil(total / pageSizeNumber)
        }
      });
    } catch (error) {
      next(error);
    }
  };
  // POST /leads
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateLeadRequestSchema.parse(req.body);
      const newLead = await prisma.lead.create({
        data: body,
      });
      res.status(201).json(newLead);
    } catch (error) {
      next(error);
    }
  };
  // GET /leads/:id
  show: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const lead = await prisma.lead.findUnique({
        where: { id: Number(id) },
        include: {
          groups: true,
          campaigns: true,
        },
      });

      if (!lead) throw new HttpError(404, "Lead não encontrado");

      res.status(201).json(lead);
    } catch (error) {
      next(error);
    }
  };
  //DELETE /leads/:id
  delete: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const find = await prisma.lead.findUnique({
        where: { id: +id },
      });
      if (!find) throw new HttpError(404, "Lead não encontrada");
      const deletedLead = await prisma.lead.delete({
        where: { id: +id },
      });
      res.status(201).json(deletedLead);
    } catch (error) {
      next(error);
    }
  };
  //PUT /leads/id
  update: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const find = await prisma.lead.findUnique({
        where: { id: +id },
      });
      if (!find) throw new HttpError(404, "Lead não encontrada");
      const body = UpdateLeadRequestSchema.parse(req.body);
      const updatedLead = await prisma.lead.update({
        data: body,
        where: { id: +id },
      });

      res.status(201).json(updatedLead);
    } catch (error) {
      next(error);
    }
  };
}
