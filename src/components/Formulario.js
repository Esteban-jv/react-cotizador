import React, { useState } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { obtenerDiferenciaYear, calcularMarca, obtenerPlan } from '../helper';

//styles
const Campo = styled.div`
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
`;

const Label = styled.label`
    flex: 0 0 100px;
`;

const Select = styled.select`
    display: block;
    width: 100%;
    padding: 1rem;
    border: 1px solid #e1e1e1;
    --webkit-appearance: none;
`;

const Radio = styled.input`
    margin: 0 1rem;
`;

const Error = styled.div`
    background-color: red;
    color: white;
    padding: 1rem;
    width: 100%;
    text-align: center;
    margin-bottom: 2rem;
`;

const Button = styled.button`
    background-color: #00838F;
    font-size: 16px;
    width: 100%;
    padding: 1rem;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    border: none;
    transition: background-color .3s ease;
    margin-top: 2rem;

    &:hover {
        cursor: pointer;
        background-color: #26C6DA;
    }
`;

const Formulario = ( { setResumen, setCargando } ) => {

    //TODO
    const [ datos, guardarDatos ] = useState({
        marca: '',
        year: '',
        plan: ''
    });
    const { marca, year, plan } = datos;
    const [ error, setError ] = useState(false);

    // leer datos de formulario
    const obtenerInfo = e => {
        guardarDatos({
            ...datos,
            [e.target.name] : e.target.value
        })
    }

    // Cuaqdno el usuario hace submit
    const cotizarSeguro = e => {
        e.preventDefault();

        if(marca.trim() === '' || year.trim() === '' || plan.trim() === '')
        {
            setError(true);
            return;
        }
        setError(false);
        // Base de 200
        let resultado = 2000;

        // Obtener la diferencia de años
        const dif = obtenerDiferenciaYear(year);
        // Por cada año hay que restar 3%
        resultado -= (( dif * 3) * resultado) / 100;

        //Americano 15%
        //Asikatico 5%
        //Europeo 30%
        resultado = calcularMarca(marca) * resultado;

        // Basico 20%
        // Completo 50%
        const incrementoPlan = obtenerPlan(plan)
        resultado = parseFloat( incrementoPlan * resultado).toFixed(2);
        setCargando(true);
        
        setTimeout(() => {
            //stop loading
            setCargando(false);

            setResumen({
                cotizacion: Number(resultado),
                datos
            });
        }, 1500);
    }

    return ( 
        <form
            onSubmit={cotizarSeguro}
        >
            { error ? <Error>Todos los campos son obligatorios</Error> : null }
            <Campo>
                <Label>Marca </Label>
                <Select
                    name="marca"
                    value={marca}
                    onChange={obtenerInfo}
                >
                    <option value="">-- Seleccione --</option>
                    <option value="americano">Americano</option>
                    <option value="europeo">Europeo</option>
                    <option value="asiatico">Asiático</option>
                </Select>
            </Campo>
            <Campo>
                <Label>Año </Label>
                <Select
                    name="year"
                    value={year}
                    onChange={obtenerInfo}
                >
                <option value="">-- Seleccione --</option>
                <option value="2021">2021</option>
                <option value="2020">2020</option>
                <option value="2019">2019</option>
                <option value="2018">2018</option>
                <option value="2017">2017</option>
                <option value="2016">2016</option>
                <option value="2015">2015</option>
                <option value="2014">2014</option>
                <option value="2013">2013</option>
                <option value="2012">2012</option>
                </Select>
            </Campo>
            <Campo>
                <Label>Plan</Label>
                <Radio
                    type="radio"
                    name="plan"
                    value="basico"
                    checked={plan==="basico"}
                    onChange={obtenerInfo}
                />Básico
                <Radio
                    type="radio"
                    name="plan"
                    value="completo"
                    checked={plan==="completo"}
                    onChange={obtenerInfo}
                />Completo
            </Campo>

            <Button type="submit">Cotizar</Button>
        </form>
     );
}
 
Formulario.propTypes = {
    setResumen: PropTypes.func.isRequired,
    setCargando: PropTypes.func.isRequired,
}

export default Formulario;