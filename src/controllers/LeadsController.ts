import { Handler } from "express";
import { prisma } from "../database";
import { CreateLeadRequestSchema, UpdateLeadRequestSchema } from "./schemas/LeadsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class LeadsController {
  // GET /leads
  index: Handler = async (req, res, next) => {
    try {
      const leads = await prisma.lead.findMany();
      res.json(leads);
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
        where: {id: +id}
      })
      if(!find) throw new HttpError(404, "Lead não encontrada")
      const deletedLead = await prisma.lead.delete({
        where: { id: +id },
      });
      res.status(201).json(deletedLead);
    } catch (error) {
      next(error)
    }
  };
  //PUT /leads/id
  update: Handler = async (req, res, next) => {
    try {
      const { id } = req.params
      const find = await prisma.lead.findUnique({
        where: {id: +id}
      })
      if(!find) throw new HttpError(404, "Lead não encontrada")
      const body = UpdateLeadRequestSchema.parse(req.body)
      const updatedLead = await prisma.lead.update({
        data: body,
        where: {id: +id}
      })

      res.status(201).json(updatedLead)
    } catch (error) {
      next(error)
    }
  }
}
