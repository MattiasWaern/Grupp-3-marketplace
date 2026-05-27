// @ts-nocheck
'use strict';

const PERMISSIONS = {
  public: {
    "api::listing.listing": ["find", "findOne"],
  },
  publicPlugins: {
    "plugin::upload.content-api": ["find", "findOne"],
    "plugin::users-permissions.user": ["find", "findOne", "me"],
  },
  authenticated: {
    "api::listing.listing": ["create", "delete", "find", "findOne", "update"],
    "api::message.message": ["create", "find", "findOne", "unreadCount", "update"],
  },
  authenticatedPlugins: {
    "plugin::upload.content-api": ["find", "findOne", "upload"],
    "plugin::users-permissions.auth": ["changePassword", "logout"],
    "plugin::users-permissions.user": ["find", "findOne", "me"],
  },

  // Admin-rollen
  admin: {
    "api::admin-users.admin-users": ["getUsers", "toggleBlock"],
  },
  adminPlugins: {
    "plugin::users-permissions.user": ["find", "findOne", "update"],
  },
};

async function getRole(strapi, type) {
  const role = await strapi
    .query("plugin::users-permissions.role")
    .findOne({ where: { type } });
  if (!role) throw new Error(`Rollen "${type}" hittades inte i databasen.`);
  return role;
}

async function ensurePermission(strapi, roleId, action) {
  const existing = await strapi
    .query("plugin::users-permissions.permission")
    .findOne({ where: { action, role: roleId } });

  if (!existing) {
    await strapi
      .query("plugin::users-permissions.permission")
      .create({ data: { action, role: roleId, enabled: true } });
    strapi.log.info(`[bootstrap] Skapade: ${action}`);
  } else if (!existing.enabled) {
    await strapi
      .query("plugin::users-permissions.permission")
      .update({ where: { id: existing.id }, data: { enabled: true } });
    strapi.log.info(`[bootstrap] Aktiverade: ${action}`);
  } else {
    strapi.log.debug(`[bootstrap] Finns redan: ${action}`);
  }
}

async function setApiPermissions(strapi, roleId, contentTypeMap) {
  for (const [uid, actions] of Object.entries(contentTypeMap)) {
    for (const action of actions) {
      await ensurePermission(strapi, roleId, `${uid}.${action}`);
    }
  }
}

async function setPluginPermissions(strapi, roleId, pluginMap) {
  for (const [pluginAction, actions] of Object.entries(pluginMap)) {
    for (const action of actions) {
      await ensurePermission(strapi, roleId, `${pluginAction}.${action}`);
    }
  }
}

module.exports = {
  register(/*{ strapi }*/) {},

  async bootstrap({ strapi }) {
    strapi.log.info("[bootstrap] Sätter permissions...");

    try {
      const [publicRole, authenticatedRole, adminRole] = await Promise.all([
        getRole(strapi, "public"),
        getRole(strapi, "authenticated"),
        getRole(strapi, "admin"),
      ]);

      // Public
      await setApiPermissions(strapi, publicRole.id, PERMISSIONS.public);
      await setPluginPermissions(strapi, publicRole.id, PERMISSIONS.publicPlugins);

      // Authenticated
      await setApiPermissions(strapi, authenticatedRole.id, PERMISSIONS.authenticated);
      await setPluginPermissions(strapi, authenticatedRole.id, PERMISSIONS.authenticatedPlugins);

      // Admin
      await setApiPermissions(strapi, adminRole.id, PERMISSIONS.admin);
      await setPluginPermissions(strapi, adminRole.id, PERMISSIONS.adminPlugins);

      strapi.log.info("[bootstrap] Klart! Alla permissions satta.");
    } catch (err) {
      strapi.log.error("[bootstrap] Fel vid inställning av permissions:", err);
    }
  },
};