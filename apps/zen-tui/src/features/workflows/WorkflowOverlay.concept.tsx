/**
 * Zen-TUI — Workflow Overlays (Commercial Grade UI)
 * 
 * Provides secondary modal layers for complex Git operations (Commit, Rebase, etc.)
 */

import { Show, For, memo } from "../../engine/reconciler.ts";
import { C } from "../../app/App.tsx";
import { HDivider, SelDot, fit } from "../views/StandardView.tsx";

// ─── WORKFLOW COMPONENTS ───

function CommitView() {
    return (

        <Zen.Box>
            {/* same as the StashView */}
        </Zen.Box>

    );
}

function RebaseView() {
    return (
        <Zen.Box>
            <Zen.Text />
            <Zen.Divider />
            <Zen.For each={[
                { op: "pick", hash: "a3f7c21", msg: "feat: add sovereign layout" },
                { op: "edit", hash: "8d4e1b9", msg: "fix: viewport fill bleed" },
                { op: "pick", hash: "c92fa03", msg: "refactor: StandardView" },
            ]}>
                {(item: any) => (
                    <Zen.Box flexDirection="row" width="100%" height={1}>
                        <Zen.Text fg={C.blue}>{item.op} </Zen.Text>
                        <Zen.Text fg={C.yellow}>{item.hash} </Zen.Text>
                        <Zen.Text fg={C.text}>{item.msg}</Zen.Text>
                    </Zen.Box>
                )}
            </Zen.For>

            {/* OR */}

            <Zen.For list={arr} render={(item: any) => (
                <Zen.Box>
                    <Zen.Text />
                    <Zen.Divider />
                    <Zen.Box height={1} />
                    <Zen.Text fg={C.text}>Save current changes to stash?</Zen.Text>
                    <Zen.Box height={1} />
                    <Zen.Text fg={C.dim}>[s] save  [p] pop latest  [l] list</Zen.Text>
                </Zen.Box>
            )}

            <Zen.For items={arr} render={MyComponent} />

            {/* there could be other patterns */}


        </Zen.Box>
    );
}

function CherryPickView() {
    return (
        <Zen.Box>
            {/* smae as the StashView */}
        </Zen.Box>
    );
}

function MergeView() {
    return (
        <Zen.Box>
            {/* smae as the StashView */}
        </Zen.Box>
    );
}

function ResetView() {
    return (
        <Zen.Box>
            {/* smae as the StashView */}
        </Zen.Box>
    );
}

function AmendView() {
    return (
        <Zen.Box>
            {/* smae as the StashView */}
        </Zen.Box>
    );
}

function SubmoduleView() {
    return (
        <Zen.Box>
            {/* smae as the StashView */}
        </Zen.Box>

    );
}

function StashView() {
    // styles just needed to handled smartly  

    // return <ZenBox {...props} />
    return <Zen.Box>
        <Zen.Text>STASH OPERATONS</Zen.Text>
        <Zen.HDivider />
        <Zen.Box height={1} />
        <Zen.Text fg={C.text}>Save current changes to stash?</Zen.Text>
        <Zen.Box height={1} />
        <Zen.Text fg={C.dim}>[s] save  [p] pop latest  [l] list</Zen.Text>
    </Zen.Box>
}

// ─── ROUTER ───

export default function WorkflowOverlay(props: { mode: () => any }) {

    // return <SmartZenRouter />

    // return SmartZenTuiRouter />

    // return <SmartZenRouter routeKey={....} routerPath={....} config={....} />

    // it could be by default memorized or we can handle that in the router itself
    // andn these routes could be optimized for our usecases but either way it's more readable , managable and consist of 2-3 lines

    return (<SmartZenRouter>
        <SmartZenTuiRouter render={....} />
    </SmartZenRouter>
    );

}
