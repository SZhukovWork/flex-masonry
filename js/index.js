//github: https://github.com/SZhukovWork/flex-tile/
class FlexTile{
    parent;
    columns;
    constructor(element) {
        if(element instanceof HTMLElement){
            this.parent = element;
        }else if(element instanceof String){
            this.parent = document.querySelector(element);
        }
        this.setHeight();
        window.addEventListener("resize",e=>this.setHeight())
    }
    setHeight(){
        let height = this.findMinHeight(this.calculateHeight(),this.calculateColumns());
        height += parseFloat(window.getComputedStyle(this.parent).getPropertyValue('padding-top'));
        height += parseFloat(window.getComputedStyle(this.parent).getPropertyValue('padding-bottom'));
        this.parent.style.height = height+"px";
    }
    calculateHeight(){
        let items = this.parent.querySelectorAll(".flex-tile-item");
        let arr = [];
        items.forEach((item, index) => {
            let height = item.offsetHeight;
            height += parseFloat(window.getComputedStyle(item).getPropertyValue('margin-top'));
            height += parseFloat(window.getComputedStyle(item).getPropertyValue('margin-bottom'));
            arr.push(height);
        })
        return arr;
    }
    calculateColumns(){
        let columns = 0;
        let items = this.parent.querySelectorAll(".flex-tile-item");
        let arr = [];
        items.forEach((item, index) => {
            let width = item.offsetWidth;
            width += parseFloat(window.getComputedStyle(item).getPropertyValue('margin-left'));
            width += parseFloat(window.getComputedStyle(item).getPropertyValue('margin-right'));
            arr.push(width);
        })
        let maxItemWidth = Math.max(...arr)-5;
        let gap = parseFloat(window.getComputedStyle(this.parent).getPropertyValue('column-gap'));
        let width = 0;
        let maxWidth = this.parent.offsetWidth - parseFloat(window.getComputedStyle(this.parent).getPropertyValue('padding-right')) - parseFloat(window.getComputedStyle(this.parent).getPropertyValue('padding-left'))
        while(width + gap < maxWidth){
            if(width > 0){
                width += gap;
            }
            width += maxItemWidth;
            columns++;
        }
        if(maxWidth < width && columns > 1)
            columns--;
        return columns;
    }
    findMinHeight(elements,columns){
        if (columns === 1) {
            return elements.reduce((accumulator,number,index,elements)=>{
                let height =  parseFloat(number);
                if(index === 1){
                    height += parseFloat(window.getComputedStyle(this.parent).getPropertyValue("row-gap"));
                }
                if(elements.length-1 !== index){
                    height += parseFloat(window.getComputedStyle(this.parent).getPropertyValue("row-gap"));
                }
                return parseFloat(accumulator) + height;
            })+5;
        }
        for(let i = 0; i < columns - 1; i++){
            elements.splice(i,0,"|");
        }
        let limit = 1000;
        let i = 0;
        let min = Math.max(...elements.join(",").split(/,?\|,?/g).map(item=>item.split(",").filter(n=>n)).filter(elements=>elements.length).map(elements=>elements.reduce((a,n)=>a-(-n))));
        let resultElements = elements.join(",").split(/,?\|,?/g).map(item=>item.split(",").filter(n=>n));
        while(elements.indexOf("|") !== elements.length - columns + 1 && i < limit){
            let indexLast = elements.lastIndexOf("|");
            if(indexLast === elements.length - 1){
                while(elements[indexLast - 1] === "|"){
                    indexLast--;
                }
                let ready = elements.length - indexLast;
                elements.splice(indexLast,ready);
                indexLast = elements.lastIndexOf("|", indexLast - 1);

                [elements[indexLast],elements[indexLast+1]] = [elements[indexLast+1],elements[indexLast]];
                elements.splice(indexLast+1,0,..."|".repeat(ready).split(""));
            }
            else{
                [elements[indexLast],elements[indexLast+1]] = [elements[indexLast+1],elements[indexLast]];
            }
            let thisMax = elements.join(",").split(/,?\|,?/g).map(item=>item.split(",").filter(n=>n)).filter(elements=>elements.length).map(elements=>elements.reduce((accumulator,number,index,elements)=>{
                let height =  parseFloat(number);
                if(index === 1){
                    height += parseFloat(window.getComputedStyle(this.parent).getPropertyValue("row-gap"));
                }
                if(elements.length-1 !== index){
                    height += parseFloat(window.getComputedStyle(this.parent).getPropertyValue("row-gap"));
                }
                return parseFloat(accumulator) + height;
            }));
            thisMax = Math.max(...thisMax);
            if(thisMax < min){
                min = thisMax;
                resultElements = elements.join(",").split(/,?\|,?/g).map(item=>item.split(",").filter(n=>n));
            }
            i++;
        }
        return min+5;
    }
}
window.addEventListener("load",e=>{
    document.querySelectorAll(".flex-tile").forEach(tile=>{
        tile.flexTile = new FlexTile(tile);
    })
})