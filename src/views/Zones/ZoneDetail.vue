<script setup>
import { ref, onMounted } from 'vue'
import itemsService from '@/service/ItemsService';
const items = ref([])
const props = defineProps({
    id: {
        type: String,
        required: true
    }
});
// Exemple de données
onMounted(async () => {
    const response = await itemsService.getItemsByZoneId(props.id);
    items.value = response.items;
    console.log(items.value);
})
</script>

<template>
  <Card>
      <template #content>
          <DataTable :value="items" :paginator="true" :rows="10"
                     paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                     :rowsPerPageOptions="[5,10,20,50]"
                     tableStyle="min-width: 50rem">
              <Column field="name" header="Nom" sortable=""></Column>
              <Column field="quantity" header="Quantité" sortable=""></Column>
              <Column field="unit" header="Unité" sortable=""></Column>
              <Column field="expirationDate" header="Date d'expiration" sortable=""></Column>
          </DataTable>
      </template>

  </Card>
</template>

<style scoped lang="scss">
.card {
  padding: 1rem;
  border-radius: 4px;
  background: white;
  box-shadow: 0 2px 1px -1px rgba(0,0,0,.2);
}
</style>
<style scoped lang="scss">

</style>
