import { UniformGrid } from "./uniform_grid";
import { Ball } from "./bodies";

export class Debug {
    static drawGrid(grid: UniformGrid, ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = "black"
        ctx.lineWidth = 0.1
        for (let i = 0; i < grid.cols_num * grid.rows_num; i++) {
            let [row, col] = grid.getRowCol(i)

            //draw grid
            ctx.strokeRect(col * grid.cellSize, row * grid.cellSize, grid.cellSize, grid.cellSize)

            //dislay indices in the top left corner of each cell
            ctx.fillStyle = "black"
            ctx.fillText(i.toString(), col * grid.cellSize + 5, row * grid.cellSize + 10)

            //display number of children in the cell in the bottom left corner of each cell
            ctx.fillStyle = "blue"
            const cell = grid.index2Cell(i)
            if (cell.children.length > 0)
                ctx.fillText(cell.children.length.toString(), col * grid.cellSize + 5, row * grid.cellSize + grid.cellSize - 5)
        }
    }

    
}