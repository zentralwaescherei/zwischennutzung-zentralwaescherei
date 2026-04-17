import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const actions = [
      'api::organisation.organisation.find',
      'api::organisation.organisation.findOne',
      'api::floor-area.floor-area.find',
      'api::floor-area.floor-area.findOne',
      'api::testimony.testimony.find',
      'api::testimony.testimony.findOne',
      'api::blog-post.blog-post.find',
      'api::blog-post.blog-post.findOne',
      'api::site-section.site-section.find',
      'api::site-section.site-section.findOne',
    ];

    const role = await strapi.db
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!role) {
      strapi.log.warn('Public role not found; skipping permission bootstrap.');
      return;
    }

    for (const action of actions) {
      const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
        where: {
          action,
          role: role.id,
        },
      });

      if (existing) {
        if (!existing.enabled) {
          await strapi.db.query('plugin::users-permissions.permission').update({
            where: { id: existing.id },
            data: { enabled: true },
          });
        }
        continue;
      }

      await strapi.db.query('plugin::users-permissions.permission').create({
        data: {
          action,
          role: role.id,
          enabled: true,
        },
      });
    }

    strapi.db.lifecycles.subscribe({
      models: ['api::blog-post.blog-post'],
      beforeCreate(event) {
        const data = event.params.data as { publishedAt?: string | null; publishDate?: string | null };
        if (data?.publishedAt && !data.publishDate) {
          throw new Error('publishDate is required when publishing a blog post.');
        }
      },
      beforeUpdate(event) {
        const data = event.params.data as { publishedAt?: string | null; publishDate?: string | null };
        if (data?.publishedAt && !data.publishDate) {
          throw new Error('publishDate is required when publishing a blog post.');
        }
      },
    });
  },
};
