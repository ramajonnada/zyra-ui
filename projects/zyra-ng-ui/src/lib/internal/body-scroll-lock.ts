// Reference-counted body scroll lock shared by every overlay that needs one
// (zyra-header's mobile drawer, zyra-modal, zyra-drawer). Each caller's
// lock()/unlock() pair is independent — document.body.style.overflow is
// only touched on the 0→1 and 1→0 transitions, so if two overlays are open
// at once (e.g. a Modal triggered from inside the header's mobile drawer),
// whichever closes first doesn't prematurely unlock scroll for the other.
let lockCount = 0;
let previousOverflow = '';

export function lockBodyScroll(doc: Document): void {
    if (lockCount === 0) {
        previousOverflow = doc.body.style.overflow;
        doc.body.style.overflow = 'hidden';
    }
    lockCount++;
}

export function unlockBodyScroll(doc: Document): void {
    if (lockCount === 0) return;
    lockCount--;
    if (lockCount === 0) {
        doc.body.style.overflow = previousOverflow;
    }
}
