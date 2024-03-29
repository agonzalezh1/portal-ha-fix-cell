import React, { useState } from 'react';
import { getLabelsBarChart } from '../../utils/functions';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Modal from '../Modal/Modal';
import SpendsList from './SpendsList';
import SalesList from '../Footer/SalesList';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/*
export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            backgroundColor: 'rgb(255, 99, 132)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            backgroundColor: 'rgb(75, 192, 192)',
        },
        {
            label: 'Dataset 3',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            backgroundColor: 'rgb(53, 162, 235)',
        },
    ],
};

//const labels = Utils.months({ count: 7 });
const data = {
    labels: labels,
    datasets: [{
        label: 'My First Dataset',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(201, 203, 207, 0.2)',
        ],
        borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)',
            'rgb(201, 203, 207)',
        ],
        borderWidth: 1,
    }],
};
*/
const SalesByStore = ({ name, sales, dailySales }) => {
    const [products] = useState(sales.map(sale => sale.products.cashPayment + sale.products.cardPayment));
    const [fixes] = useState(sales.map(sale => sale.fixes.cashPayment + sale.fixes.cardPayment));
    const [airtime] = useState(sales.map(sale => sale.airtime));
    const [spends] = useState(dailySales.spend.reduce( (acc, current) => acc + current.amount, 0));
    const [openModal, setOpenModal] = useState(false);
    const [openSalesModal, setOpenSalesModal] = useState(false);
    const monthsToShow = 6;

    const total = dailySales.products.cashPayment + dailySales.products.cardPayment + dailySales.fixes.cashPayment + dailySales.fixes.cardPayment + dailySales.airtime - spends;

    const options = {
        plugins: {
            title: { display: true, text: name },
        },
        responsive: true,
        scales: {
            x: { stacked: true },
            y: { stacked: true },
        },
    };

    const labels = getLabelsBarChart(monthsToShow);

    const data = {
        labels,
        datasets: [
            {
                label: 'Productos',
                data: products.slice(-1 * monthsToShow),
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Reparaciones',
                data: fixes.slice(-1 * monthsToShow),
                backgroundColor: 'rgb(75, 192, 192)',
            },
            {
                label: 'Recargas',
                data: airtime.slice(-1 * monthsToShow),
                backgroundColor: 'rgb(53, 162, 235)',
            },
        ],
    };

    return (<>
        <div className='store-item'>
            <div className='daily-sale'>
                <h3 className='branch-name' onClick={() => setOpenSalesModal(true)}>{name}</h3>
                <table>
                    <thead>
                        <tr className='bold'>
                            <th>Venta del día</th>
                            <th>Efectivo</th>
                            <th>Tarjeta</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className='bold'>Productos</td>
                            <td className='numeric'>{`$${dailySales.products.cashPayment}.00`}</td>
                            <td className='numeric'>{`$${dailySales.products.cardPayment}.00`}</td>
                        </tr>
                        <tr>
                            <td className='bold'>Reparaciones</td>
                            <td className='numeric'>{`$${dailySales.fixes.cashPayment}.00`}</td>
                            <td className='numeric'>{`$${dailySales.fixes.cardPayment}.00`}</td>
                        </tr>
                        <tr>
                            <td className='bold'>Tiempo aire</td>
                            <td className='numeric'>{`$${dailySales.airtime}.00`}</td>
                            <td />
                        </tr>
                        <tr>
                            <td className='bold spend-style' onClick={() => setOpenModal(true)}>Gastos</td>
                            <td className='numeric'>{`$${spends}.00`}</td>
                            <td />
                        </tr>
                        <tr className='bold'>
                            <td>Total</td>
                            <td className='numeric' colSpan={2}>{`$${total}.00`}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className='chart'><Bar options={options} data={data} /></div>
        </div>
        <Modal open={openModal} title={'Detalle de gastos'} onClose={() => setOpenModal(false)}>
            <SpendsList list={dailySales.spend}/>
        </Modal>
        <Modal open={openSalesModal} title={'Detalle de ventas'} onClose={() => setOpenSalesModal(false)}>
            <SalesList list={dailySales.products.list}/>
        </Modal>
    </>);
};

export default SalesByStore;
