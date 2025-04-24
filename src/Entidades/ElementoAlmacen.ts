import { Entidad } from "./Entidad.js";
import Bien from "./Bien.js";

/**
 * Interfaz que representa un elemento almacenado en el inventario.
 * Contiene un bien y la cantidad de ese bien almacenada.
 */
export default class ElementoAlmacen implements Entidad {
  public readonly ID: number;

  constructor(
    public bien: Bien,
    public cantidad: number,
  ) {
    this.ID = bien.ID;
  }

  toJSON(): Record<string, any> {
    return {
      ID: this.ID,
      bien:{
        ID: this.bien.ID,
        nombre: this.bien.nombre,
        descripcion: this.bien.descripcion,
        material: this.bien.material,
        peso: this.bien.peso,
        precio: this.bien.precio,
      },
      cantidad: this.cantidad,
    };
  }

  static fromJSON(json: any): ElementoAlmacen {
    const bien = Bien.fromJSON(json.bien);
    return new ElementoAlmacen(bien, json.cantidad);
  }

  tostring(): string {
    return `ID: ${this.ID}, Nombre: ${this.bien.nombre}, Descripción: ${this.bien.descripcion}, Material: ${this.bien.material}, Peso: ${this.bien.peso}, Precio: ${this.bien.precio}, Cantidad: ${this.cantidad}`;
  }

}
