const Agent = require("../models/agentModel");
const AgentDetails = require("../models/agentDetailModel");
const { Op } = require("sequelize"); // Import Op from Sequelize

// Create a new Agent
exports.createAgent = async (req, res) => {
  const { name, fee, is_active } = req.body;

  try {
    const agent = await Agent.create({ name, fee, is_active });
    return res.status(201).json(agent);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create agent" });
  }
};

// Get all Agents
exports.getAgents = async (req, res) => {
  try {
    const { limit, offset, name, is_active, startDate, endDate } = req.query;

    // Construct the query options
    let queryOptions = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      where: {
        is_active: true
      },
      include: [
        {
          model: AgentDetails,
          as: "AgentDetails",
          attributes: ["id", "code", "name", "is_active", "agentDetailsId"],
          where: {
            is_active: true, // Ensure only active details are included
          },
          required: false, // This allows PaymentMethods without active details to be included if they are active
        },
      ],
    };

    if (name) {
      queryOptions.where.name = name;
    }

    if (is_active) {
      queryOptions.where.is_active = is_active;
    }

    // If a date range is provided, add it to the query options
    // if (startDate && endDate) {
    //   queryOptions.where.expired_at = {
    //     [Op.between]: [new Date(startDate), new Date(endDate)],
    //   };
    // }
    const agents = await Agent.findAll(queryOptions);

    // Count total items without limit and offset
    const totalCount = await Agent.count({
        where: queryOptions.where,
      });

    return res.status(200).json({agents, totalCount});
  } catch (error) {
    return res.status(400).json({ status: "Bad Request", message: error.message });
  }
};

// Update an Agent
exports.updateAgent = async (req, res) => {
  const { id } = req.params;
  const { name, fee, is_active } = req.body;

  try {
    const agent = await Agent.findByPk(id);
    if (!agent) {
      return res.status(404).json({ status: "Bad Request", message: "Agent not found" });
    }

    agent.name = name;
    agent.fee = fee;
    agent.is_active = is_active;
    await agent.save();

    return res.status(200).json({
        status: "Success",
        message: "Success Update Agent!"
      });
  } catch (error) {
    return res.status(400).json({ status: "Bad Request", message: error.message });
  }
};

// Delete an Agent
exports.deleteAgent = async (req, res) => {
  const { id } = req.params;
  try {
    const agent = await Agent.findByPk(id);
    if (!agent) {
      return res.status(400).json({ status: "Bad Request",message: "Agent not found" });
    }

    agent.is_active = 0;
    await agent.save();
    return res.status(200).send({
        status: "Success",
        message: "Success Delete Agent!"
      });
  } catch (error) {
    return res.status(400).json({ status: "Bad Request",message: error.message });
  }
};

exports.addAgentDetails = async (req, res) => {
  try {
    const { code, name, is_active, agentDetailsId } = req.body;
    const agent = await Agent.findByPk(agentDetailsId);
    if(!agent) {
        throw { message: "Agent not found"}
    }
    
    await AgentDetails.create({
      code,
      name,
      is_active,
      agentDetailsId,
    });
    res.status(200).json({
      status: "Success",
      message: "Success Adding Agent Detail!",
    });
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};

// Update Agent Detail
exports.updateAgentDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { code, name, is_active, agentDetailsId } = req.body;
    const agentDetails = await AgentDetails.findByPk(id);
    const agent = await Agent.findByPk(agentDetailsId);
    if(!agent) {
        throw { message: "Agent not found"}
    }

    if (agentDetails) {
      agentDetails.code = code;
      agentDetails.name = name;
      agentDetails.is_active = is_active;
      agentDetails.agentDetailsId = agentDetailsId;
      await agentDetails.save();
      res
        .status(200)
        .json({
          status: "Success",
          message: "Success Updating Agent Detail!",
        });
    } else {
      res
        .status(400)
        .json({
          status: "Bad Request",
          error: "Agent Detail not found",
        });
    }
  } catch (error) {
    res.status(400).json({ status: "Bad Request", message: error.message });
  }
};
