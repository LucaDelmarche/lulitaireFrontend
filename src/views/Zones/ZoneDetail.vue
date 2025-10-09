<script setup>
import { ref, onMounted } from 'vue';
import itemsService from '@/service/ItemsService';
import {formatDate} from '@/utils/functions';
const items = ref([])
const showAddDialog = ref(false)
const rows = ref(5)
const page = ref(0)
const totalItems = ref(null);
const showDeleteDialog = ref(false)
const itemToDeleteId = ref(null)
const showEditDialog = ref(false)
const newItem = ref({
    Name: '',
    Quantity: '',
    Unit: '',
    ExpirationDate: '',
    Location: '',
    ZoneId: 0
})
const editItem = ref({
    name: '',
    quantity: '',
    unit: '',
    expirationDate: '',
    location: ''
})

onMounted(async () => {
    const response = await itemsService.getItemsByZoneId(props.id,1,10);
    totalItems.value = parseInt(response.totalItems);
    console.log(totalItems.value);
    items.value = response.items;
})
const props = defineProps({
    id: {
        type: String,
        required: true
    }
});

const confirmDelete = (id) => {
    itemToDeleteId.value = id
    showDeleteDialog.value = true
}
const deleteConfirmed = async () => {
    await itemsService.deleteItem(itemToDeleteId.value)
    if(totalItems.value - 1 <= rows.value && page.value > 1) {
        page.value = page.value - 1
    }
    const updatedItems = await itemsService.getItemsByZoneId(props.id, page.value, rows.value)
    items.value = updatedItems.items
    totalItems.value = parseInt(updatedItems.totalItems)
    showDeleteDialog.value = false
    itemToDeleteId.value = null
}



const edit = (item) => {
    editItem.value = { ...item }
    showEditDialog.value = true
}
const add = () => {
    showAddDialog.value = true;
}
const saveNewItem = async () => {
    const payload = {
            Name: newItem.value.Name,
            Quantity: Number(newItem.value.Quantity),
            Unit: newItem.value.Unit,
            ExpirationDate: formatDate(newItem.value.ExpirationDate),
            Location: newItem.value.Location,
            ZoneId: parseInt(props.id)
    };
    await itemsService.createItem(payload);
    showAddDialog.value = false;
    newItem.value = { Name: '', Quantity: '', Unit: '', ExpirationDate: '', Location: '',ZoneId: 0 };
    const updatedItems = await itemsService.getItemsByZoneId(props.id);
    totalItems.value = parseInt(updatedItems.totalItems);
    items.value = updatedItems.items;
}
const saveEditItem = async () => {
    const payload = {
        name: editItem.value.name,
        quantity: Number(editItem.value.quantity),
        unit: editItem.value.unit,
        expirationDate: formatDate(editItem.value.expirationDate),
        location: editItem.value.location
    }
    await itemsService.editItem(editItem.value.id, payload)
    showEditDialog.value = false
    const updatedItems = await itemsService.getItemsByZoneId(props.id, page.value, rows.value)
    items.value = updatedItems.items
    totalItems.value = parseInt(updatedItems.totalItems)
}
const onPageChange = async (event) => {
    page.value = event.page + 1;
    const response = await itemsService.getItemsByZoneId(props.id,page.value,event.rows);
    items.value = response.items;
}
const deleteItem = async (id) => {
    await itemsService.deleteItem(id);
    const updatedItems = await itemsService.getItemsByZoneId(props.id,page.value,rows.value);
    items.value = updatedItems.items;
    totalItems.value = parseInt(updatedItems.totalItems);
}
</script>

<template>
  <Card>
      <template #content>
          <DataTable
              paginator:false
              v-if="totalItems >0"
              :value="items"
              v-model:rows="rows"
              :totalRecords="totalItems"
              :rowsPerPageOptions="[5,10,20,50]"
              @page="onPageChange"
          >
              <Column field="name" header="Nom" sortable=""></Column>
              <Column field="quantity" header="Quantité" sortable=""></Column>
              <Column field="unit" header="Unité" sortable=""></Column>
              <Column field="expirationDate" header="Date d'expiration" sortable=""></Column>
              <Column field="location" header="Rayon" sortable=""></Column>
              <Column header="Actions">
                  <template #body="slotProps">
                      <Button icon="pi pi-pencil" @click="edit(slotProps.data)" class="p-button-rounded p-button-success p-mr-2" />
                      <Button icon="pi pi-trash" @click="confirmDelete(slotProps.data.id)" class="ml-2 p-button-rounded p-button-danger" />
                  </template>
              </Column>
          </DataTable>
          <Paginator :rows="rows" :v-model:page="page" :totalRecords="totalItems" @page="onPageChange" :rows-per-page-options="[5,10,20,50]"></Paginator>

      </template>
      <template #footer>
          <Button @click="add" label="Ajouter un article" icon="pi pi-plus" class="p-button-sm" />
      </template>
  </Card>
    <Dialog
        v-model:visible="showAddDialog"
        header="Ajouter un article"
        :modal="true"
        :closable="false"
        class="p-fluid p-dialog-sm"
    >
        <form @submit.prevent="saveNewItem" >
            <div class="p-fluid">
                <div class="p-grid p-formgrid p-mb-3">
                    <!-- Nom -->
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="name">Nom</label>
                        <InputText id="name" v-model="newItem.Name" required class="w-full" />
                    </div>

                    <!-- Quantité -->
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="quantity">Quantité</label>
                        <InputNumber id="quantity" v-model="newItem.Quantity" :min="0" required class="w-full" />
                    </div>

                    <!-- Unité -->
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="unit">Unité</label>
                        <InputText id="unit" v-model="newItem.Unit" required class="w-full" />
                    </div>

                    <!-- Date d'expiration -->
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="expirationDate">Date d'expiration</label>
                        <Calendar id="expirationDate" v-model="newItem.ExpirationDate" dateFormat="dd/mm/yy" showIcon required class="w-full" />
                    </div>

                    <!-- Rayon -->
                    <div class="p-field p-col-12 flex flex-col mb-4">
                        <label for="location">Rayon</label>
                        <InputText id="location" v-model="newItem.Location" required class="w-full" />
                    </div>
                </div>
            </div>


            <div class="flex justify-between">
                <Button
                    label="Annuler"
                    icon="pi pi-times"
                    @click="showAddDialog = false"
                    class="p-button-text"
                />
                <Button
                    label="Ajouter"
                    icon="pi pi-check"
                    type="submit"
                    class="p-button-success"
                />
            </div>
        </form>
    </Dialog>
    <Dialog
        v-model:visible="showDeleteDialog"
        header="Confirmer la suppression"
        :modal="true"
        :closable="false"
        class="p-dialog-sm"
    >
        <div>Voulez-vous vraiment supprimer cet article ?</div>
        <div class="flex justify-between mt-4">
            <Button label="Annuler" icon="pi pi-times" @click="showDeleteDialog = false" class="p-button-text" />
            <Button label="Supprimer" icon="pi pi-trash" @click="deleteConfirmed" class="p-button-danger" />
        </div>
    </Dialog>
    <Dialog
        v-model:visible="showEditDialog"
        header="Modifier l'article"
        :modal="true"
        :closable="false"
        class="p-fluid p-dialog-sm"
    >
        <form @submit.prevent="saveEditItem">
            <div class="p-fluid">
                <div class="p-grid p-formgrid p-mb-3">
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="edit-name">Nom</label>
                        <InputText id="edit-name" v-model="editItem.name" required class="w-full" />
                    </div>
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="edit-quantity">Quantité</label>
                        <InputNumber id="edit-quantity" v-model="editItem.quantity" :min="0" required class="w-full" />
                    </div>
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="edit-unit">Unité</label>
                        <InputText id="edit-unit" v-model="editItem.unit" required class="w-full" />
                    </div>
                    <div class="p-field p-col-12 p-md-6 flex flex-col mb-4">
                        <label for="edit-expirationDate">Date d'expiration</label>
                        <Calendar id="edit-expirationDate" v-model="editItem.expirationDate" dateFormat="dd/mm/yy" showIcon required class="w-full" />
                    </div>
                    <div class="p-field p-col-12 flex flex-col mb-4">
                        <label for="edit-location">Rayon</label>
                        <InputText id="edit-location" v-model="editItem.location" required class="w-full" />
                    </div>
                </div>
            </div>
            <div class="flex justify-between">
                <Button label="Annuler" icon="pi pi-times" @click="showEditDialog = false" class="p-button-text" />
                <Button label="Enregistrer" icon="pi pi-check" type="submit" class="p-button-success" />
            </div>
        </form>
    </Dialog>
</template>
