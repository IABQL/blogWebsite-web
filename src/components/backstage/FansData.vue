<template>
		<!-- 为 ECharts 准备一个定义了宽高的 DOM -->
	  <div id="main" style="width: 600px;height:400px;"></div>
</template>


<script>
	import * as echarts from 'echarts';

export default {
  
  mounted(){
    this.drawCurve();
  },
  methods: {
	  
    drawCurve(){
        // 基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('main'));
		const option = {
		  xAxis: {
		    type: 'category',
		    data: ['2022.1', '2022.2', '2022.3', '2022.4', '2022.5', '2022.6', '2022.7']
		  },
		  yAxis: {
		    type: 'value'
		  },
		  series: [
		    {
		      data: [10, 0, 4, 8, 5, 7, 0],
		      type: 'line'
		    }
		  ]
		}
        // 绘制图表
        myChart.setOption(option);
    },
	
  }
}
  
</script>

<style scoped>
</style>
