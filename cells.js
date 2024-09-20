class Cell {
    constructor(gameXDim) {
        this.value = -1;
        this.color = "purple";
        this.gameXDim = gameXDim;
        this.lastCollapse = -1;
    }

    collapse(currentIndex, gameGrid, newGameGrid) {
        throw new Error("Collapse method not implemented.");
    }

    
    draw(ctx) {
        ctx.fillStyle = this.color;
        // Additional drawing logic could go here (like filling a rectangle)
    }

    getNeighborIndex(currentIndex, xMod, yMod) {
        return currentIndex + (this.gameXDim * yMod + xMod);
    }

    neighborCheck(currentIndex, gameGrid,xChecks = [], yChecks = [], valuesCheck = []) {
        for (const xMod of xChecks) {
            for (const yMod of yChecks) {
                if (xMod === 0 && yMod === 0) continue; // Skip the center cell
                const neighborIndex = this.getNeighborIndex(currentIndex, xMod, yMod);
                
                if (neighborIndex < 0 || neighborIndex >= gameGrid.length) continue; // Bounds check
                if ( gameGrid[neighborIndex].lastCollapse >= this.lastCollapse) continue;

                const neighborValue = gameGrid[neighborIndex].value;

                // Check if the current value is in the valuesCheck array
                if (valuesCheck.indexOf(neighborValue) !== -1) {
                    return { index: neighborIndex, cell: gameGrid[neighborIndex] };
                }
            }
        }
        return { index: currentIndex, cell: gameGrid[currentIndex] };
    }
     switchPlace(newGameGrid,neighbor,currentIndex, currentCicle) {
        newGameGrid[neighbor.index] = this; // Move the sand cell down
        newGameGrid[currentIndex] = neighbor.cell; // Replace current position with the moved cell
        neighbor.cell.lastCollapse = currentCicle
     }

}

class Air extends Cell {
    constructor(gameXDim) {
        super(gameXDim); // Pass the parameter to the parent constructor
        this.value = 0;
        this.color = "white";
    }

    collapse(currentIndex, gameGrid, newGameGrid) {
        // Implement collapse logic if needed
    }
}

class Sand extends Cell {
    constructor(gameXDim) {
        super(gameXDim); // Pass the parameter to the parent constructor
        this.value = 1;
        this.color = "yellow";
    }

    collapse(currentCicle,currentIndex, gameGrid, newGameGrid) {
        if(this.lastCollapse == currentCicle) return
        this.lastCollapse = currentCicle
        const neighbor = this.neighborCheck(currentIndex,gameGrid,[0,-1,1],[1],[0,2])
        if(neighbor.index == currentIndex) return
        if (neighbor.cell.value != 1) {
            this.switchPlace(newGameGrid,neighbor,currentIndex,currentCicle)

        }
    }
}

class Water extends Cell {
    constructor(gameXDim) {
        super(gameXDim); // Pass the parameter to the parent constructor
        this.value = 1;
        this.color = "blue";
    }

    collapse(currentCicle,currentIndex, gameGrid, newGameGrid){
        if(this.lastCollapse == currentCicle) return
        this.lastCollapse = currentCicle
        const neighbor = this.neighborCheck(currentIndex,gameGrid,[0,-1,1],[1,0],[0])
        if(neighbor.cell.value === 0){
            this.switchPlace(newGameGrid,neighbor,currentIndex,currentCicle)
        }
    }
}

// Exporting the cell types
const cellType = { Air, Sand, Water };
export default cellType;
