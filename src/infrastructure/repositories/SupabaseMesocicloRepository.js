const supabase = require('../database/supabase')

class SupabaseMesocicloRepository {
    async listarTodos() {
        const { data, error } = await supabase
          .from('mesociclos')
          .select(`
            *,
            macrociclos(
              id, nombre, activo, sensei_id,
              senseis(usuario_id, usuarios(nombre, apellido_paterno))
            ),
            mesociclo_judokas(
              id, judoka_id,
              judokas(id, usuario_id, usuarios(nombre, apellido_paterno))
            )
          `)
          .order('fecha_inicio', { ascending: true })
        if (error) throw new Error(error.message)
        return data
      }
      
      async listarPorSensei(senseiId) {
        // Primero obtenemos los macrociclos del sensei
        const { data: macros, error: errorMacros } = await supabase
          .from('macrociclos')
          .select('id')
          .eq('sensei_id', senseiId)
          .eq('activo', true)
      
        if (errorMacros) throw new Error(errorMacros.message)
        if (!macros || macros.length === 0) return []
      
        const macroIds = macros.map(m => m.id)
      
        const { data, error } = await supabase
          .from('mesociclos')
          .select(`
            *,
            macrociclos(
              id, nombre, activo, sensei_id,
              senseis(usuario_id, usuarios(nombre, apellido_paterno))
            ),
            mesociclo_judokas(
              id, judoka_id,
              judokas(id, usuario_id, usuarios(nombre, apellido_paterno))
            )
          `)
          .in('macrociclo_id', macroIds)
          .order('fecha_inicio', { ascending: true })
      
        if (error) throw new Error(error.message)
        return data
      }
      
      async listarPorMacrociclo(macrocicloId) {
        const { data, error } = await supabase
          .from('mesociclos')
          .select(`
            *,
            mesociclo_judokas(
              id, judoka_id,
              judokas(id, usuario_id, usuarios(nombre, apellido_paterno))
            )
          `)
          .eq('macrociclo_id', macrocicloId)
          .order('fecha_inicio', { ascending: true })
        if (error) throw new Error(error.message)
        return data
      }
      
      async obtener(id) {
        const { data, error } = await supabase
          .from('mesociclos')
          .select(`
            *,
            macrociclos(id, nombre, fecha_inicio, fecha_fin, sensei_id),
            mesociclo_judokas(
              id, judoka_id,
              judokas(id, usuario_id, usuarios(nombre, apellido_paterno))
            ),
            microciclos(id, fecha, estado, calificacion_sensei)
          `)
          .eq('id', id)
          .single()
        if (error) throw new Error(error.message)
        return data
      }
      
      async crear(datos) {
        const { macrociclo_id, nombre, fecha_inicio, fecha_fin } = datos
      
        // Validar fechas dentro del macrociclo
        const { data: macro, error: errorMacro } = await supabase
          .from('macrociclos')
          .select('fecha_inicio, fecha_fin')
          .eq('id', macrociclo_id)
          .single()
      
        if (errorMacro) throw new Error('Macrociclo no encontrado')
        if (fecha_inicio < macro.fecha_inicio || fecha_fin > macro.fecha_fin) {
          throw new Error('Las fechas deben estar dentro del macrociclo')
        }
      
        const { data, error } = await supabase
          .from('mesociclos')
          .insert([{ macrociclo_id, nombre, fecha_inicio, fecha_fin }])
          .select()
          .single()
        if (error) throw new Error(error.message)
        return data
      }
      
      async actualizar(id, datos) {
        const { data, error } = await supabase
          .from('mesociclos')
          .update(datos)
          .eq('id', id)
          .select()
          .single()
        if (error) throw new Error(error.message)
        return data
      }
      
      async asignarJudoka(mesocicloId, judokaId) {
        const { data, error } = await supabase
          .from('mesociclo_judokas')
          .insert([{ mesociclo_id: mesocicloId, judoka_id: judokaId }])
          .select()
          .single()
        if (error) throw new Error(error.message)
        return data
      }
      
      async quitarJudoka(mesocicloId, judokaId) {
        const { error } = await supabase
          .from('mesociclo_judokas')
          .delete()
          .eq('mesociclo_id', mesocicloId)
          .eq('judoka_id', judokaId)
        if (error) throw new Error(error.message)
        return true
      }
    }
module.exports = SupabaseMesocicloRepository