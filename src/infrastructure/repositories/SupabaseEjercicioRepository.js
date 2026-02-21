const supabase = require('../database/supabase')

class SupabaseEjercicioRepository {
  async listar() {
    const { data, error } = await supabase
      .from('banco_ejercicios')
      .select('*')
      .eq('activo', true)
      .order('nombre', { ascending: true })
    if (error) throw new Error(error.message)
    return data
  }

  async obtener(id) {
    const { data, error } = await supabase
      .from('banco_ejercicios')
      .select('*')
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async crear(datos) {
    const { data, error } = await supabase
      .from('banco_ejercicios')
      .insert([datos])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from('banco_ejercicios')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async desactivar(id) {
    const { data, error } = await supabase
      .from('banco_ejercicios')
      .update({ activo: false })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }
}

module.exports = SupabaseEjercicioRepository