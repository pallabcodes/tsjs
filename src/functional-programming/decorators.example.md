package com.netflix.productivity.service;

import com.netflix.productivity.dto.IssueDto;
import com.netflix.productivity.entity.Issue;
import com.netflix.productivity.mapper.IssueMapper;
import com.netflix.productivity.repository.IssueRepository;
import com.netflix.productivity.security.RequirePermission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class IssueService {

    private static final String ISSUE_NOT_FOUND = "Issue not found";

    private final IssueRepository issueRepository;
    private final IssueMapper issueMapper;

    public IssueService(IssueRepository issueRepository, IssueMapper issueMapper) {
        this.issueRepository = issueRepository;
        this.issueMapper = issueMapper;
    }

    @Cacheable(cacheNames = CacheNames.ISSUE_LIST, key = "#tenantId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    @RequirePermission("ISSUE_READ")
    @Transactional(readOnly = true)
    public Page<IssueDto> list(String tenantId, Pageable pageable) {
        return issueRepository.findAllActiveByTenant(tenantId, pageable)
                .map(issueMapper::toDto);
    }

    @Cacheable(cacheNames = CacheNames.ISSUE_LIST_BY_PROJECT, key = "#tenantId + ':' + #projectId + ':' + #pageable.pageNumber + ':' + #pageable.pageSize")
    @RequirePermission("ISSUE_READ")
    @Transactional(readOnly = true)
    public Page<IssueDto> listByProject(String tenantId, String projectId, Pageable pageable) {
        String normalizedProjectId = normalize(projectId);
        return issueRepository.findByTenantAndProject(tenantId, normalizedProjectId, pageable)
                .map(issueMapper::toDto);
    }

    @RequirePermission("ISSUE_WRITE")
    public IssueDto create(IssueDto dto) {
        Issue entity = issueMapper.toEntity(dto);
        return issueMapper.toDto(issueRepository.save(entity));
    }

    @Cacheable(cacheNames = CacheNames.ISSUE_BY_KEY, key = "#tenantId + ':' + #key")
    @RequirePermission("ISSUE_READ")
    @Transactional(readOnly = true)
    public IssueDto getByKey(String tenantId, String key) {
        String normalizedKey = normalize(key);
        Issue entity = issueRepository.findByTenantAndKey(tenantId, normalizedKey)
                .orElseThrow(() -> new IllegalArgumentException(ISSUE_NOT_FOUND));
        return issueMapper.toDto(entity);
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}


# now how would the above java code would look like with ts

### 1) TypeScript with decorators + functional core (TaskEither pipeline)

// domain.ts
export type Issue = { id: string; tenantId: string; key: string; title: string };
export type Page<T> = { items: ReadonlyArray<T>; total: number };
export type Pageable = { page: number; size: number };

export interface IssueRepo {
  findAllActiveByTenant(tenantId: string, p: Pageable): Promise<Page<Issue>>;
  findByTenantAndProject(tenantId: string, projectId: string, p: Pageable): Promise<Page<Issue>>;
  findByTenantAndKey(tenantId: string, key: string): Promise<Issue | null>;
  save(i: Issue): Promise<Issue>;
}

export interface Perms {
  has(userId: string, perm: string): Promise<boolean>;
}

export interface Cache {
  get<T>(k: string): Promise<T | undefined>;
  set<T>(k: string, v: T, ttlSec: number): Promise<void>;
}

export interface Ctx {
  tenantId: string;
  userId: string;
  repo: IssueRepo;
  perms: Perms;
  cache: Cache;
}

// fp.ts
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

export const fromPromise = <A>(thunk: () => Promise<A>) =>
  TE.tryCatch(thunk, (e) => new Error(String(e)));

export const ensure = <A>(pred: (a: A) => boolean, err: Error) =>
  (fa: TE.TaskEither<Error, A>) =>
    pipe(fa, TE.filterOrElse(pred, () => err));

// decorators.ts
type Method = (...args: any[]) => Promise<any>;

export function RequirePermission(perm: string) {
  return function (_: any, __: string, desc: PropertyDescriptor) {
    const orig: Method = desc.value;
    desc.value = async function (ctx: Ctx, ...rest: any[]) {
      const ok = await ctx.perms.has(ctx.userId, perm);
      if (!ok) throw new Error("forbidden");
      return orig.apply(this, [ctx, ...rest]);
    };
  };
}

export function Cacheable(keyFn: (...a: any[]) => string, ttlSec = 300) {
  return function (_: any, __: string, desc: PropertyDescriptor) {
    const orig: Method = desc.value;
    desc.value = async function (ctx: Ctx, ...rest: any[]) {
      const key = keyFn(ctx, ...rest);
      const cached = await ctx.cache.get<any>(key);
      if (cached !== undefined) return cached;
      const res = await orig.apply(this, [ctx, ...rest]);
      await ctx.cache.set(key, res, ttlSec);
      return res;
    };
  };
}

// IssueService.decorator.ts
import { RequirePermission, Cacheable } from "./decorators";
import { fromPromise, ensure } from "./fp";
import * as TE from "fp-ts/TaskEither";

export class IssueService {
  @Cacheable((ctx, p) => `issueList:${ctx.tenantId}:${p.page}:${p.size}`, 600)
  @RequirePermission("ISSUE_READ")
  list(ctx: Ctx, p: Pageable) {
    return TE
      .of(ctx.tenantId)
      .chain(() => fromPromise(() => ctx.repo.findAllActiveByTenant(ctx.tenantId, p)))
      .then(TE.match(
        (e) => { throw e; },
        (ok) => ok
      ));
  }

  @Cacheable((ctx, projectId, p) => `issueListByProject:${ctx.tenantId}:${projectId}:${p.page}:${p.size}`, 600)
  @RequirePermission("ISSUE_READ")
  listByProject(ctx: Ctx, projectId: string, p: Pageable) {
    return fromPromise(() => ctx.repo.findByTenantAndProject(ctx.tenantId, projectId.trim(), p))
      .then(TE.match(
        (e) => { throw e; },
        (ok) => ok
      ));
  }

  @Cacheable((ctx, key) => `issueByKey:${ctx.tenantId}:${key}`, 600)
  @RequirePermission("ISSUE_READ")
  getByKey(ctx: Ctx, key: string) {
    return fromPromise(() => ctx.repo.findByTenantAndKey(ctx.tenantId, key.trim()))
      .then(ensure((x): x is NonNullable<typeof x> => x != null, new Error("Issue not found")))
      .then(TE.match(
        (e) => { throw e; },
        (ok) => ok
      ));
  }

  @RequirePermission("ISSUE_WRITE")
  create(ctx: Ctx, dto: Issue) {
    const withTenant = { ...dto, tenantId: ctx.tenantId };
    return fromPromise(() => ctx.repo.save(withTenant))
      .then(TE.match(
        (e) => { throw e; },
        (ok) => ok
      ));
  }
}

### 2) TypeScript without decorators, pure composition with higher order functions


// hofs.ts
import { pipe } from "fp-ts/function";
import * as TE from "fp-ts/TaskEither";

export const withPermission = (perm: string) =>
  <A>(f: (ctx: Ctx) => Promise<A>) =>
    async (ctx: Ctx) => {
      const ok = await ctx.perms.has(ctx.userId, perm);
      if (!ok) throw new Error("forbidden");
      return f(ctx);
    };

export const withArgs =
  <A extends any[], R>(f: (ctx: Ctx, ...args: A) => Promise<R>) =>
    (ctx: Ctx, ...args: A) => f(ctx, ...args);

export const withCache =
  <A extends any[], R>(key: (ctx: Ctx, ...args: A) => string, ttlSec = 300) =>
    (f: (ctx: Ctx, ...args: A) => Promise<R>) =>
      async (ctx: Ctx, ...args: A) => {
        const k = key(ctx, ...args);
        const c = await ctx.cache.get<R>(k);
        if (c !== undefined) return c;
        const r = await f(ctx, ...args);
        await ctx.cache.set(k, r, ttlSec);
        return r;
      };

export const tryTE = <A>(thunk: () => Promise<A>) =>
  TE.tryCatch(thunk, (e) => new Error(String(e)));

// IssueService.composed.ts
import { withPermission, withCache, withArgs, tryTE } from "./hofs";
import * as TE from "fp-ts/TaskEither";

export const list = withPermission("ISSUE_READ")(
  withArgs(async (ctx: Ctx, p: Pageable) =>
    TE.match(
      (e) => { throw e; },
      (ok) => ok
    )(await tryTE(() => ctx.repo.findAllActiveByTenant(ctx.tenantId, p))())
  )
);

export const listCached = withCache(
  (ctx, p: Pageable) => `issueList:${ctx.tenantId}:${p.page}:${p.size}`,
  600
)(list as any);

export const listByProject = withPermission("ISSUE_READ")(
  withCache(
    (ctx, projectId: string, p: Pageable) => `issueListByProject:${ctx.tenantId}:${projectId}:${p.page}:${p.size}`,
    600
  )(withArgs(async (ctx: Ctx, projectId: string, p: Pageable) =>
    TE.match(
      (e) => { throw e; },
      (ok) => ok
    )(await tryTE(() => ctx.repo.findByTenantAndProject(ctx.tenantId, projectId.trim(), p))())
  ))
);

export const getByKey = withPermission("ISSUE_READ")(
  withCache(
    (ctx, key: string) => `issueByKey:${ctx.tenantId}:${key}`,
    600
  )(withArgs(async (ctx: Ctx, key: string) =>
    TE.match(
      (e) => { throw e; },
      (x) => {
        if (!x) throw new Error("Issue not found");
        return x;
      }
    )(await tryTE(() => ctx.repo.findByTenantAndKey(ctx.tenantId, key.trim()))())
  ))
);

export const create = withPermission("ISSUE_WRITE")(
  withArgs(async (ctx: Ctx, dto: Issue) =>
    TE.match(
      (e) => { throw e; },
      (ok) => ok
    )(await tryTE(() => ctx.repo.save({ ...dto, tenantId: ctx.tenantId }))())
  )
);

### 3) TypeScript with Effect framework

// effect-issue.ts
import { pipe } from "effect/Function";
import * as Effect from "effect/Effect";
import * as Context from "effect/Context";

export class Repo extends Context.Tag("Repo")<Repo, IssueRepo>() {}
export class Perm extends Context.Tag("Perm")<Perm, Perms>() {}
export class CacheTag extends Context.Tag("CacheTag")<CacheTag, Cache>() {}
export class Env extends Context.Tag("Env")<Env, { tenantId: string; userId: string }>() {}

const requirePerm = (perm: string) =>
  Effect.flatMap(Effect.context<Perm | Env>(), ctx =>
    Effect.promise(() => ctx.get(Perm).has(ctx.get(Env).userId, perm)).pipe(
      Effect.filterOrFail(Boolean, () => new Error("forbidden")),
      Effect.asUnit
    )
  );

const cached = <A extends ReadonlyArray<any>, R>(
  key: (...a: A) => string,
  ttlSec = 300,
  eff: (...a: A) => Effect.Effect<R, Error, Repo | CacheTag | Env>
) =>
  (...a: A) =>
    Effect.flatMap(Effect.context<CacheTag>(), ctx =>
      Effect.promise(() => ctx.get(CacheTag).get<R>(key(...a))).pipe(
        Effect.flatMap((hit) =>
          hit !== undefined
            ? Effect.succeed(hit)
            : eff(...a).pipe(
                Effect.tap((val) =>
                  Effect.promise(() => ctx.get(CacheTag).set(key(...a), val, ttlSec))
                )
              )
        )
      )
    );

export const list = (p: Pageable) =>
  pipe(
    requirePerm("ISSUE_READ"),
    Effect.flatMap(() =>
      Effect.context<Repo | Env>().pipe(
        Effect.flatMap((ctx) =>
          Effect.promise(() => ctx.get(Repo).findAllActiveByTenant(ctx.get(Env).tenantId, p))
        )
      )
    )
  );

export const listCached = (p: Pageable) =>
  cached((ctx: any) => `issueList:${ctx.tenantId}:${p.page}:${p.size}`, 600, () =>
    Effect.flatMap(Effect.context<Env>(), env => list(p).pipe(Effect.provideService(Env, env.get(Env))))
  )({});

export const listByProject = (projectId: string, p: Pageable) =>
  pipe(
    requirePerm("ISSUE_READ"),
    Effect.flatMap(() =>
      Effect.context<Repo | Env>().pipe(
        Effect.flatMap((ctx) =>
          Effect.promise(() => ctx.get(Repo).findByTenantAndProject(ctx.get(Env).tenantId, projectId.trim(), p))
        )
      )
    )
  );

export const getByKey = (key: string) =>
  pipe(
    requirePerm("ISSUE_READ"),
    Effect.flatMap(() =>
      Effect.context<Repo | Env>().pipe(
        Effect.flatMap((ctx) =>
          Effect.promise(() => ctx.get(Repo).findByTenantAndKey(ctx.get(Env).tenantId, key.trim()))
        ),
        Effect.flatMap((x) => x ? Effect.succeed(x) : Effect.fail(new Error("Issue not found")))
      )
    )
  );

export const create = (dto: Issue) =>
  pipe(
    requirePerm("ISSUE_WRITE"),
    Effect.flatMap(() =>
      Effect.context<Repo | Env>().pipe(
        Effect.flatMap((ctx) =>
          Effect.promise(() => ctx.get(Repo).save({ ...dto, tenantId: ctx.get(Env).tenantId }))
        )
      )
    )
  );