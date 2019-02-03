
export enum SortOrder {
    ASC, DESC
}

export class SortEntry {
    constructor(
        public field: string,
        public order: SortOrder = SortOrder.ASC) {}
}

export class Sort {
    entries: SortEntry[] = [];

    add(field: string, order: SortOrder = SortOrder.ASC) {
        this.entries.push(new SortEntry(field, order));
    }

    clear(): void {
        this.entries.length = 0;
    }
}

export class Pagination {
    sort: Sort = null;

    page = 1;
    size: number = null;

    first?: number = null;
    prev?: number = null;
    next?: number = null;
    last?: number = null;

    reset(): void {
        this.first = null;
        this.prev = null;
        this.next = null;
        this.last = null;
    }

    available(): boolean {
        return this.first != null
            || this.prev != null
            || this.next != null
            || this.last != null;
    }
}
