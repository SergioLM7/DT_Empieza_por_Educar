const queries = {
    createCandidato: `INSERT INTO 
        candidatos 
            (nombre_candidato, apellidos_candidato, email_candidato, telefono_candidato, edad, carrera, nota_media, nivel_ingles, sexo, cv)
    VALUES
        (?, 
        ?,
        ?, 
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?);`,
    readAllCandidatos: `SELECT 
        *
    FROM 
        candidatos
    LIMIT 
        ? 
    OFFSET
        ?;`,
    readCandidatoEmail: `SELECT
        *
    FROM
        candidatos
    WHERE
        email_candidato = ?;`,
    updateCandidato: `UPDATE
        candidatos
    SET
        nombre_candidato= COALESCE(?, nombre_candidato),
        apellidos_candidato= COALESCE(?, apellidos_candidato),
        email_candidato= COALESCE(?, email_candidato),
        telefono_candidato= COALESCE(?, telefono_candidato),
        edad= COALESCE(?, edad),
        carrera= COALESCE(?, carrera),
        nota_media= COALESCE(?, nota_media),
        nivel_ingles= COALESCE(?, nivel_ingles),
        sexo= COALESCE(?, sexo),
        cv= COALESCE(?, cv)
    WHERE 
        id_candidato = ?;`,
    deleteCandidato: `DELETE 
        cas, cd, comp
    FROM 
        candidatos cd
    LEFT JOIN 
        candidaturas cas ON cd.id_candidato = cas.id_candidato
    LEFT JOIN 
        competencias comp ON cas.id_candidatura = comp.id_candidatura
    WHERE 
        cd.id_candidato = ?;`
}

module.exports = queries;