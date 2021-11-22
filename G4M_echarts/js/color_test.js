jQuery.getJSON('data/test.json',function (graph){
    graph.nodes.forEach(function (node) {
        c = node.color;
        rgb2rgba(c,0.1)
    })
});

function rgb2rgba(color, a) {
    rgb = color.substring(4,color.length-1);
    rgba = "rgba("+rgb+","+a+")";
    return rgba;
}
