<template>
  <v-container>
    <h2 class="text-h5 font-weight-bold mb-4">Votacions</h2>

    <v-row>
      <v-col v-for="(label, index) in labels" :key="index" cols="12" sm="6" md="3">
        <v-btn
          block
          size="large"
          color="primary"
          :disabled="!connected"
          @click="vote(index)"
        >
          {{ label }}
        </v-btn>
      </v-col>
    </v-row>

    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>

    <v-card class="results mx-auto">
      <v-card-title>Resultats</v-card-title>
      <v-list>
        <v-list-item v-for="(label, index) in labels" :key="index">
          <v-list-item-title>{{ label }}</v-list-item-title>
          <template #append>
            <strong>{{ store.votos[index] }} vots</strong>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <p class="status mt-4">
      <template v-if="connected">Connectat a {{ wsUrl }}</template>
      <template v-else>{{ socketError || 'Connectant-se al servidor…' }}</template>
    </p>
  </v-container>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { useAppStore } from '@/stores/votos'
import { useVotosSocket } from '@/composables/useVotosSocket'
import Chart from 'chart.js/auto'

const labels = ['Opció 1', 'Opció 2', 'Opció 3', 'Opció 4']

const store = useAppStore()
const { connected, socketError, wsUrl, sendVote } = useVotosSocket()
const chartCanvas = ref(null)
let chartInstance = null

function vote(index) {
  sendVote(index)
}

const chartData = {
  labels,
  datasets: [
    {
      label: 'Vots',
      data: [...store.votos],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
      ],
    },
  ],
}

onMounted(() => {
  if (chartCanvas.value) {
    const ctx = chartCanvas.value.getContext('2d')
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    })
  }
})

watch(
  () => [...store.votos],
  (newVotos) => {
    if (chartInstance) {
      chartInstance.data.datasets[0].data = newVotos
      chartInstance.update()
    }
  },
)
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 50vh;
  width: 90vw;
  max-width: 800px;
  margin: 20px auto;
}

.results {
  max-width: 800px;
}

.status {
  text-align: center;
  font-size: 0.875rem;
  color: #666;
}
</style>
