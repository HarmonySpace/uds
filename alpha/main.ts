import { colors } from "colors/cliffy";
import { Input, Select } from "prompt/cliffy";

const error = colors.bold.bgRed;
const warn =  colors.bold.bgYellow;
const success = colors.bold.green;
const info = colors.bold.blue;
console.clear()
console.log(info("Creador de Atajos de aplicaciones"));
let name: string = await Input.prompt("Nombre del atajo");
let comment: string = await Input.prompt("Descripción");
let exec: string = await Input.prompt("Ruta completa del ejecutable");
let icon: string = await Input.prompt("Ruta completa del icono");
console.clear()
while (!name || !exec || !icon) {
  if (!name) {
    console.log(warn(" ! Nombre del atajo vacio "));
    name = await Input.prompt("Nombre");
  }
  if (!exec) {
    console.log(warn(" ! Ruta del ejecutable vacia "));
    exec = await Input.prompt("Ejecutable");
  }
  if (!icon) {
    console.log(warn(" ! Ruta del icono vacia "));
    icon = await Input.prompt("Icono");
  }
}
console.clear()
let file = `[Desktop Entry]
Version=1.0
Type=Application
Name=${name}
Comment=${comment}
Exec=${exec}
Icon=${icon}
Terminal=false
`;
let fileName = `${name.toLowerCase().replace(/\s/g, "-")}.desktop`;
let confirmation: number = 0;
while (confirmation !== 5) {
  console.log(info("File:"), fileName);
  console.log(file);
  confirmation = await Select.prompt({
    message: "Editar",
    options: [
      { name: "Name", value: 1 },
      { name: "Comment", value: 2 },
      { name: "Exec", value: 3 },
      { name: "Icon", value: 4 },
      Select.separator("----------------"),
      { name: "Confirmar", value: 5 },
      { name: "Cancelar", value: 6 }
    ]
  })
  if (confirmation === 6) {
    break;
  } else if (confirmation === 1) {
    name = await Input.prompt("Nombre del atajo");
    fileName = `${name.toLowerCase().replace(/\s/g, "-")}.desktop`;
  } else if (confirmation === 2) {
    comment = await Input.prompt("Descripción");
  } else if (confirmation === 3) {
    exec = await Input.prompt("Ruta completa del ejecutable");
  } else if (confirmation === 4) {
    icon = await Input.prompt("Ruta completa del icono");
  } else {
    console.log(warn(" ! Opción invalida "));
  }
  file = `[Desktop Entry]
Version=1.0
Type=Application
Name=${name}
Comment=${comment}
Exec=${exec}
Icon=${icon}
Terminal=false
  `;
  console.clear()
}
if (confirmation === 6) {
  console.log(error(" x Cancelled, no se ha creado el archivo "));
  Deno.exit();
}
console.log(info("File generated"));
console.log(success(file));
const absHomeDir = Deno.env.get("HOME")!;
const path = `${absHomeDir}/.local/share/applications/${fileName}`;
await Deno.writeTextFile(path, file);
console.log(success("Archivo creado con éxito"));
