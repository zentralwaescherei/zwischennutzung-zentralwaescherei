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
      async beforeUpdate(event) {
        const data = event.params.data as { publishedAt?: string | null; publishDate?: string | null };
        const id = event.params.where?.id as number | undefined;
        const existing = id
          ? ((await strapi.db
              .query('api::blog-post.blog-post')
              .findOne({ where: { id } })) as { publishedAt?: string | null; publishDate?: string | null } | null)
          : null;
        const effectivePublishedAt = data?.publishedAt ?? existing?.publishedAt ?? null;
        const effectivePublishDate = data?.publishDate ?? existing?.publishDate ?? null;
        if (effectivePublishedAt && !effectivePublishDate) {
          throw new Error('publishDate is required when publishing a blog post.');
        }
      },
    });

    strapi.db.lifecycles.subscribe({
      models: ['api::testimony.testimony'],
      beforeCreate(event) {
        const data = event.params.data as {
          isAnonymous?: boolean;
          personName?: string | null;
          publishedAt?: string | null;
          isApproved?: boolean;
        };
        if (!data?.isAnonymous && !data?.personName) {
          throw new Error('personName is required unless testimony is anonymous.');
        }
        if (data?.publishedAt && !data?.isApproved) {
          throw new Error('isApproved must be true before publishing testimony.');
        }
      },
      async beforeUpdate(event) {
        const data = event.params.data as {
          isAnonymous?: boolean;
          personName?: string | null;
          publishedAt?: string | null;
          isApproved?: boolean;
        };
        const id = event.params.where?.id as number | undefined;
        const existing = id
          ? ((await strapi.db
              .query('api::testimony.testimony')
              .findOne({ where: { id } })) as {
              isAnonymous?: boolean;
              personName?: string | null;
              publishedAt?: string | null;
              isApproved?: boolean;
            } | null)
          : null;
        const effectiveIsAnonymous = data?.isAnonymous ?? existing?.isAnonymous ?? false;
        const effectivePersonName = data?.personName ?? existing?.personName ?? null;
        const effectivePublishedAt = data?.publishedAt ?? existing?.publishedAt ?? null;
        const effectiveIsApproved = data?.isApproved ?? existing?.isApproved ?? false;
        if (!effectiveIsAnonymous && !effectivePersonName) {
          throw new Error('personName is required unless testimony is anonymous.');
        }
        if (effectivePublishedAt && !effectiveIsApproved) {
          throw new Error('isApproved must be true before publishing testimony.');
        }
      },
    });
  },
};
