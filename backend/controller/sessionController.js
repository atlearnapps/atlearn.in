import Users from "../models/users.js";
import Roles from "../models/roles.js";
import Role_permissions from "../models/role_permissions.js";
import Permissions from "../models/permissions.js";
import Pricing from "../models/pricing.js";
async function session(req, res) {
  try {
    const userId = req.user.user_id;
    const permission = {};
    if (userId) {
      const user = await Users.findOne({
        where: { id: userId },
        // include: [{ model: Roles, as: "role" }],
        include: [
          { model: Roles, as: "role" },
          { model: Pricing, as: "subscription" },
        ],
      });
      if (user) {
        if (user.status === true) {
          return res.json({ message: "User blocked", success: false });
        }
        const roleId = user?.role?.id;

        const rolePermissionValues = await Role_permissions.findAll({
          where: {
            role_id: roleId,
          },
          include: [
            {
              model: Permissions,
            },
          ],
        });

        rolePermissionValues?.forEach((item) => {
          permission[item?.permission?.name] = item.value;
        });
      } else {
        return res.json({ message: "User Not Found", success: false });
      }

      delete user.dataValues?.password;
      return res.json({
        data: { user, permission },

        success: true,
      });
    } else {
      return res.json({ message: "User Not Found", success: false });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

export default {
  session,
};
