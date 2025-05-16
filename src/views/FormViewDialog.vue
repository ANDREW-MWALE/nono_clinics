<template>
  <v-dialog v-model="internalDialog" max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Phone Details</span>
      </v-card-title>

      <v-card-text>
        <v-form ref="form" v-model="valid">
          <!-- Conditionally Render Input Fields -->
          <v-text-field
            v-if="showPhoneFields"
            v-model="form.phoneNumber"
            label="Phone Number"
            type="tel"
            required
          ></v-text-field>

          <v-text-field
            v-if="showPhoneFields"
            v-model="form.emailAddress"
            label="Email Address"
            type="email"
          ></v-text-field>

          <v-text-field
            v-if="showPhoneFields"
            v-model="form.consultation"
            label="Consultation"
          ></v-text-field>

          <!-- Add other fields if needed based on the condition -->
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="red" text @click="closeDialog">Cancel</v-btn>
        <v-btn color="green" text @click="submitForm">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "FormDialog",
  props: {
    dialog: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      internalDialog: this.dialog, // Local state to sync with parent
      valid: false,
      showPhoneFields: true, // Set to true to show phone-related fields
      form: {
        id: null,
        phoneNumber: "",
        emailAddress: "",
        consultation: "",
        // Add other fields here as needed
      },
    };
  },
  watch: {
    dialog(val) {
      this.internalDialog = val;
    },
    internalDialog(val) {
      this.$emit("update:dialog", val);
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:dialog", false);
    },
    submitForm() {
      if (this.valid) {
        this.$emit("submit", this.form); // Emit form data to parent
      } else {
        alert("Please fill all required fields.");
      }
    },
  },
};
</script>
