import { Body } from "./bodies";
import { Vector } from "./vector";

class Cell {
    //top left corner
    x: number
    y: number

    w: number
    h: number

    index: number
    children: Body[]

    constructor(index: number, x: number, y: number, w: number, h: number) {
        this.x = x
        this.y = y
        this.index = index
        this.w = w
        this.h = h
        this.children = []
    }
}


export class UniformGrid {
    rows_num: number;
    cols_num: number;
    cellSize: number;
    uuidRb2Cell: Map<string, Cell>;
    gridIndex2Cell: Map<number, Cell>;

    constructor(cellSize: number, canvasWidth: number, canvasHeight: number) {
        this.rows_num = Math.ceil(canvasHeight / cellSize);
        this.cols_num = Math.ceil(canvasWidth / cellSize);
        this.cellSize = cellSize;

        this.gridIndex2Cell = new Map<number, Cell>();
        this.uuidRb2Cell = new Map<string, Cell>();

        //initialize grid with empty arrays
        for (let i = 0; i < this.cols_num * this.rows_num; i++) {
            let [row, col] = this.getRowCol(i)
            this.gridIndex2Cell.set(i, new Cell(i, col * this.cellSize, row * this.cellSize, this.cellSize, this.cellSize))
        }
    }


    getNeighbours(rb: Body): Body[] {
        const cell = this.rb2Cell(rb)
        return cell.children.filter((child) => child.uuid != rb.uuid)
    }


    getRowCol(index: number): [number, number] {
        return [index % this.rows_num, Math.floor(index / this.rows_num),]
    }



    isWithinCell(rb: Body, cell: Cell): boolean {
        return rb.pos.x > cell.x &&
            rb.pos.x < cell.x + cell.w &&
            rb.pos.y > cell.y &&
            rb.pos.y < cell.y + cell.h
    }

    update(rb) {
        if (this.uuidRb2Cell.has(rb.uuid)) {
            if (this.isWithinCell(rb, this.rb2Cell(rb))) {
                //if rb is in the same cell as vefore
                return
            } else {
                //if rb is not in the same cell
                this.removeFromCell(rb)
            }
        }
        else {
            //if rb is not stored in the grid at all
            this.uuidRb2Cell.set(rb.uuid, this.pos2Cell(rb.pos))
        }

        this.assignToCell(rb)

    }


    assignToCell(rb: Body): void {
        this.pos2Cell(rb.pos).children.push(rb)
    }


    removeFromCell(rb: Body): void {
        const cell = this.rb2Cell(rb)
        cell.children = cell.children.filter((child) => child.uuid != rb.uuid)
    }

    pos2Index(x: number, y: number): number {
        let col = Math.floor(x / this.cellSize)
        let row = Math.floor(y / this.cellSize)
        return col * this.rows_num + row
    }

    pos2Cell(pos: Vector): Cell {
        return this.index2Cell(this.pos2Index(pos.x, pos.y))
    }

    rb2Index(rb: Body): number {
        return this.rb2Cell(rb).index
    }

    rb2Cell(rb: Body): Cell {
        return this.uuidRb2Cell.get(rb.uuid)
    }

    index2Cell(index: number): Cell {
        return this.gridIndex2Cell.get(rb.uuid)
    }

}