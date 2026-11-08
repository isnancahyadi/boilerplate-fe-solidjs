/**
 * Form Utilities
 *
 * Mengonversi objek JavaScript berlapis menjadi instance FormData untuk multipart/form-data upload.
 */

export function appendFormData(
  data: Record<string, unknown>,
  formData: FormData = new FormData(),
  parentKey = "",
): FormData {
  if (data === null || data === undefined) {
    return formData;
  }

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) {
      continue;
    }

    const formKey = parentKey ? `${parentKey}[${key}]` : key;

    if (value instanceof Blob) {
      formData.append(formKey, value);
    } else if (Array.isArray(value)) {
      for (const item of value) {
        if (item instanceof Blob) {
          formData.append(`${formKey}[]`, item);
        } else if (typeof item === "object" && item !== null) {
          appendFormData(item as Record<string, unknown>, formData, `${formKey}[]`);
        } else {
          formData.append(`${formKey}[]`, String(item));
        }
      }
    } else if (typeof value === "object") {
      appendFormData(value as Record<string, unknown>, formData, formKey);
    } else {
      formData.append(formKey, String(value));
    }
  }

  return formData;
}
