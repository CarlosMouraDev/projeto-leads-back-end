import { Handler } from "express";
import { prisma } from "../database";
import { CreateGroupRequestSchema, UpdateGroupRequestSchema } from "./schemas/GroupsRequestSchema";
import { HttpError } from "../errors/HttpError";

export class GroupsController {
  //GET /groups
  index: Handler = async (req, res, next) => {
    try {
      const groups = await prisma.group.findMany();
      res.status(201).json(groups);
    } catch (error) {
      next(error);
    }
  };
  //POST /groups
  create: Handler = async (req, res, next) => {
    try {
      const body = CreateGroupRequestSchema.parse(req.body);
      const newGroup = await prisma.group.create({
        data: body,
      });
      res.status(201).json(newGroup);
    } catch (error) {
      next(error);
    }
  };
  //GET /groups/:id
  show: Handler = async (req, res, next) => {
    try {
      const group = await prisma.group.findUnique({
        where: { id: Number(req.params.id) },
        include: { leads: true },
      });
      if(!group) throw new HttpError(404, "Grupo não encontrado.")
      res.status(201).json(group)
    } catch (error) {
      next(error);
    }
  };
  //PUT /groups/:id
  update: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = UpdateGroupRequestSchema.parse(req.body)
      const find = await prisma.group.findUnique({
        where: { id: +id },
      });
      if (!find) throw new HttpError(404, "Lead não encontrada");
      const updated = await prisma.group.update({
        data: body,
        where: {id: +id}
      })
      res.status(200).json(updated)
    } catch (error) {
      next(error);
    }
  };
  //DELETE /groups/:id
  delete: Handler = async (req, res, next) => {
    try {
      const { id } = req.params;
      const find = await prisma.group.findUnique({
        where: { id: +id },
      });
      if (!find) throw new HttpError(404, "Lead não encontrada");
      const deletedGroup = await prisma.group.delete({
        where: {id: +id}
      })
      res.status(201).json(deletedGroup)
    } catch (error) {
      next(error);
    }
  };
}
