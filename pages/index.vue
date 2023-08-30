
<template>
  <div>
    <v-container>
      <h1>Gerador de Credenciais</h1>


      <div class="py-4">
        <form @submit.prevent="handleSubmit">
          <v-text-field v-model="data.nomeCompleto" label="Nome Completo" variant="outlined"></v-text-field>

          <div class="mb-5">
            <v-input label="Data de Nascimento">
              <vue-date-picker v-model="data.dataNascimento" :text-input="textInputOptions" :enable-time-picker="false"
                :format="format" locale="pt-br" />
            </v-input>
          </div>

          <v-text-field v-model="data.cpf" label="CPF" variant="outlined"></v-text-field>

          <v-text-field v-model="data.matricula" label="Matrícula" variant="outlined"></v-text-field>

          <v-text-field v-model="data.campus" label="Campus" variant="outlined"></v-text-field>

          <v-text-field v-model="data.curso" label="Curso" variant="outlined"></v-text-field>

          <v-text-field v-model="data.anoIngresso" label="Ano de Ingresso" variant="outlined"></v-text-field>

          <v-text-field v-model="data.previsaoConclusao" label="Previsão de Conclusão" variant="outlined"></v-text-field>

          <v-file-input v-model="data.fotoPerfil" label="Foto de Perfil" variant="outlined"></v-file-input>

          <v-btn type="submit" block color="green-darken-4">Gerar Credencial</v-btn>
        </form>

        <div v-if="preview" class="my-4">
          <img class="preview-img" :src="preview" alt="">
        </div>
      </div>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
const textInputOptions = {
  format: 'dd/MM/yyyy'
};

const format = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
}


const data = reactive({
  nomeCompleto: '',
  dataNascimento: new Date(),
  cpf: '',
  matricula: '',
  campus: '',
  curso: '',
  anoIngresso: '',
  previsaoConclusao: '',
  fotoPerfil: [],
})

const preview = ref<string | null>(null);

const readAsBase64 = (blob: Blob) => new Promise<string>(resolve => {
  const fileReader = new FileReader();

  fileReader.onload = () => {
    const result = <string>fileReader.result;

    if (result.includes("base64,")) {
      resolve(result.slice(result.indexOf("base64,") + 7))
    } else {
      resolve(result)
    }
  }

  fileReader.readAsDataURL(blob)
})

const getFormData = async () => {

  const foto = data.fotoPerfil[0] ?? null;

  if (!foto) {
    return null;
  }

  const arquivoFotoPerfilBase64 = await readAsBase64(foto);


  return {
    nomeCompleto: data.nomeCompleto,
    dataNascimento: data.dataNascimento.toISOString(),
    cpf: data.cpf,
    matricula: data.matricula,
    campus: data.campus,
    curso: data.curso,
    anoIngresso: +data.anoIngresso,
    previsaoConclusao: +data.previsaoConclusao,

    arquivoFotoPerfilBase64,
  }
}

const handleSubmit = async () => {

  preview.value = null;

  const formData = await getFormData()

  const response = await fetch("/api/gerar-credencial", {
    method: "post",
    body: JSON.stringify(formData),
    headers: {
      'Content-Type': "application/json"
    }
  });

  const blob = await response.blob();

  const url = URL.createObjectURL(blob);

  preview.value = url;
}


</script>

<style scoped>
.preview-img {
  display: block;
  max-width: 300px;
  min-width: 200px;
  border: 1px solid #333;
}
</style>