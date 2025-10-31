import Role_permissions from "../models/role_permissions.js";
import Roles from "../models/roles.js";
import Permissions from "../models/permissions.js";

async function getAllRolePermission(req, res) {
  //   const { name } = req.body;
  try {
    const rolePermissionValues = await Role_permissions.findAll({
      include: [
        {
          model: Roles,
        },
        {
          model: Permissions,
        },
      ],
    });
    if (rolePermissionValues?.length === 0) {
      res.status(404).json({ message: "Role Permission Not Found" });
    } else {
      res.send({ message: "success", data: rolePermissionValues });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function patchRolePermission(req, res) {
    const { role_id, permission_id, value } = req.body;
    try {
      const rolePermissionValues = await Role_permissions.findOne({
        where: {
            role_id: role_id,
            permission_id: permission_id
        },
      });
      if(value){
        rolePermissionValues.value = value;
      }
      if(rolePermissionValues) {
        await rolePermissionValues.save();
        res.json({  message: " The role permission has been updated" });
      } else {
        res.json({  message: " The role permission not found" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

async function getRolePermissionById(req, res) {
    const id = req?.params?.id;
    try {
      const rolePermissionValues = await Role_permissions.findAll({
        where: {
            role_id: id,
        },
        include: [
          {
            model: Roles,
          },
          {
            model: Permissions,
          },
        ],
      });
      if (rolePermissionValues?.length === 0) {
        res.status(404).json({ message: "Role Permission Not Found" });
      } else {
        res.send({ message: "success", data: rolePermissionValues });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}

export default { getAllRolePermission, getRolePermissionById, patchRolePermission };
