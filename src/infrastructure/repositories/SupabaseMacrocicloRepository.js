const supabase = require('../database/supabase')

class SupabaseMacrocicloRepository {
  async listarPorSensei(senseiId) {
    const { data, error } = await supabase
      .from('macrociclos')
      .select(`
        *,
        macrociclo_judokas(
          id, activo,
          judokas(id, usuario_id, usuarios(nombre, apellido_paterno))
        )
      `)
      .eq('sensei_id', senseiId)
      .eq('activo', true)
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }

  async obtener(id) {
    const { data, error } = await supabase
      .from('macrociclos')
      .select(`
        *,
        macrociclo_judokas(
          id, activo,
          judokas(id, usuario_id, usuarios(nombre, apellido_paterno))
        ),
        mesociclos(*)
      `)
      .eq('id', id)
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async crear(datos) {
    const { data, error } = await supabase
      .from('macrociclos')
      .insert([datos])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async actualizar(id, datos) {
    const { data, error } = await supabase
      .from('macrociclos')
      .update(datos)
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async asignarJudoka(macrocicloId, judokaId) {
    const { data: existente } = await supabase
      .from('macrociclo_judokas')
      .select('id')
      .eq('judoka_id', judokaId)
      .eq('activo', true)

    if (existente && existente.length > 0) {
      throw new Error('El judoka ya tiene un macrociclo activo')
    }

    const { data, error } = await supabase
      .from('macrociclo_judokas')
      .insert([{ macrociclo_id: macrocicloId, judoka_id: judokaId, activo: true }])
      .select()
      .single()
    if (error) throw new Error(error.message)
    return data
  }

  async quitarJudoka(macrocicloJudokaId) {
    const { error } = await supabase
      .from('macrociclo_judokas')
      .update({ activo: false })
      .eq('id', macrocicloJudokaId)
    if (error) throw new Error(error.message)
    return true
  }
}

module.exports = SupabaseMacrocicloRepository