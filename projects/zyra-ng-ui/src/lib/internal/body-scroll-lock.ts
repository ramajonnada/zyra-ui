// Reference-counted body scroll lock shared by every overlay that needs one
// (zyra-header's mobile drawer, zyra-modal, zyra-drawer). Each caller's
// lock()/unlock() pair is independent — document.body.style.overflow is
// only touched on the 0→1 and 1→0 transitions, so if two overlays are open
// at once (e.g. a Modal triggered from inside the header's mobile drawer),
// whichever closes first doesn't prematurely unlock scroll for the other.
//
// State is scoped per Document (not a single module-level counter) — SSR
// can render multiple requests against distinct document instances, and a
// shared global would leak lock state across them.
interface LockState {
    count: number;
    previousOverflow: string;
}

const states = new WeakMap<Document, LockState>();

function stateFor(doc: Document): LockState {
    let state = states.get(doc);
    if (!state) {
        state = { count: 0, previousOverflow: '' };
        states.set(doc, state);
    }
    return state;
}

export function lockBodyScroll(doc: Document): void {
    const state = stateFor(doc);
    if (state.count === 0) {
        state.previousOverflow = doc.body.style.overflow;
        doc.body.style.overflow = 'hidden';
    }
    state.count++;
}

export function unlockBodyScroll(doc: Document): void {
    const state = stateFor(doc);
    if (state.count === 0) return;
    state.count--;
    if (state.count === 0) {
        doc.body.style.overflow = state.previousOverflow;
    }
}
