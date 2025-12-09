'use client';

import { useState, useMemo } from 'react';

export default function CalculadoraPrestamos() {
  const [monto, setMonto] = useState(500000);
  const [tasaAnual, setTasaAnual] = useState(12);
  const [plazoMeses, setPlazoMeses] = useState(24);
  const [mostrarTabla, setMostrarTabla] = useState(false);

  const formatoMoneda = new Intl.NumberFormat('es-DO', {
    style: 'currency',
    currency: 'DOP',
    maximumFractionDigits: 2,
  });

  const resultados = useMemo(() => {
    const P = Number(monto);
    const n = Number(plazoMeses);
    const tasa = Number(tasaAnual);

    if (!P || !n || tasa < 0) {
      return {
        cuota: 0,
        totalPagar: 0,
        totalIntereses: 0,
        tasaMensual: 0,
      };
    }

    const r = tasa / 12 / 100;

    let cuota;
    if (r === 0) {
      cuota = P / n;
    } else {
      const factor = Math.pow(1 + r, n);
      cuota = P * ((r * factor) / (factor - 1));
    }

    const totalPagar = cuota * n;
    const totalIntereses = totalPagar - P;

    return {
      cuota,
      totalPagar,
      totalIntereses,
      tasaMensual: r,
    };
  }, [monto, tasaAnual, plazoMeses]);

  const tablaAmortizacion = useMemo(() => {
    const P = Number(monto);
    const n = Number(plazoMeses);
    const r = resultados.tasaMensual;
    const cuota = resultados.cuota;

    if (!P || !n || cuota <= 0) return [];

    let saldo = P;
    const filas = [];

    for (let mes = 1; mes <= n; mes++) {
      const interesMes = r * saldo;
      let capitalMes = cuota - interesMes;

      if (mes === n) {
        capitalMes = saldo;
      }

      const nuevoSaldo = saldo - capitalMes;

      filas.push({
        mes,
        cuota,
        capital: capitalMes,
        interes: interesMes,
        saldo: nuevoSaldo < 0.01 ? 0 : nuevoSaldo,
      });

      saldo = nuevoSaldo;
    }

    return filas;
  }, [monto, plazoMeses, resultados]);

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4 text-slate-900">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
        
        {/* TITULO PRINCIPAL */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-slate-900">
          Calculadora de Préstamos
        </h1>
        <p className="text-center text-slate-500 mt-2 mb-10 text-sm sm:text-base">
          Calcula tu cuota mensual, intereses y tabla de amortización.
        </p>

        {/* GRID RESPONSIVE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* FORMULARIO */}
          <section>
            <h2 className="text-xl font-semibold mb-5 text-slate-800">Datos del préstamo</h2>

            <div className="space-y-5">

              <div>
                <label className="block text-sm font-semibold mb-1">Monto (RD$)</label>
                <input
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Tasa anual (%)</label>
                <input
                  type="number"
                  value={tasaAnual}
                  onChange={(e) => setTasaAnual(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">Plazo (meses)</label>
                <input
                  type="number"
                  value={plazoMeses}
                  onChange={(e) => setPlazoMeses(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm sm:text-base focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <button
                onClick={() => setMostrarTabla(!mostrarTabla)}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-xl text-sm sm:text-base font-semibold shadow hover:bg-blue-700 transition"
              >
                {mostrarTabla ? "Ocultar tabla" : "Mostrar tabla de amortización"}
              </button>

            </div>
          </section>

          {/* RESULTADOS */}
          <section>
            <h2 className="text-xl font-semibold mb-5 text-slate-800">Resultados</h2>

            <div className="space-y-4">

              <div className="rounded-xl bg-blue-50 border border-blue-300 p-4">
                <h3 className="text-sm font-semibold text-blue-700">Cuota mensual</h3>
                <p className="text-2xl font-bold mt-1 text-blue-900">
                  {formatoMoneda.format(resultados.cuota || 0)}
                </p>
              </div>

              <div className="rounded-xl bg-green-50 border border-green-300 p-4">
                <h3 className="text-sm font-semibold text-green-700">Total a pagar</h3>
                <p className="text-xl font-bold mt-1 text-green-900">
                  {formatoMoneda.format(resultados.totalPagar || 0)}
                </p>
              </div>

              <div className="rounded-xl bg-red-50 border border-red-300 p-4">
                <h3 className="text-sm font-semibold text-red-700">Total intereses</h3>
                <p className="text-xl font-bold mt-1 text-red-900">
                  {formatoMoneda.format(resultados.totalIntereses || 0)}
                </p>
              </div>

            </div>
          </section>
        </div>

        {/* TABLA RESPONSIVE */}
        {mostrarTabla && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold mb-5 text-slate-800">
              Tabla de amortización
            </h2>

            <div className="overflow-x-auto border rounded-xl shadow">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-200 text-slate-700">
                  <tr>
                    <th className="px-3 py-2 text-left">Mes</th>
                    <th className="px-3 py-2 text-right">Cuota</th>
                    <th className="px-3 py-2 text-right">Capital</th>
                    <th className="px-3 py-2 text-right">Interés</th>
                    <th className="px-3 py-2 text-right">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {tablaAmortizacion.map((fila, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                      <td className="px-3 py-2">{fila.mes}</td>
                      <td className="px-3 py-2 text-right">{formatoMoneda.format(fila.cuota)}</td>
                      <td className="px-3 py-2 text-right text-green-700 font-semibold">
                        {formatoMoneda.format(fila.capital)}
                      </td>
                      <td className="px-3 py-2 text-right text-red-700 font-semibold">
                        {formatoMoneda.format(fila.interes)}
                      </td>
                      <td className="px-3 py-2 text-right">{formatoMoneda.format(fila.saldo)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
