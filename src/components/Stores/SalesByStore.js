import React, { useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend );

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

    const [products] = useState(sales.map(sale => sale.products));
    const [fixes] = useState(sales.map(sale => sale.fixes));
    const [airtime] = useState(sales.map(sale => sale.airtime));

    const options = {
        plugins: {
            title: {
                display: true,
                text: name,
            },
        },
        responsive: true,
        scales: {
            x: {
                stacked: true,
            },
            y: {
                stacked: true,
            },
        },
    };

    const labels = ['Junio', 'Julio', 'Agosto'];

    const data = {
        labels,
        datasets: [
            {
                label: 'Productos',
                data: products,
                backgroundColor: 'rgb(255, 99, 132)',
            },
            {
                label: 'Reparaciones',
                data: fixes,
                backgroundColor: 'rgb(75, 192, 192)',
            },
            {
                label: 'Recargas',
                data: airtime,
                backgroundColor: 'rgb(53, 162, 235)',
            },
        ],
    };

    return (<>
        <div className='store-item'>
            <div className='chart'><Bar options={options} data={data} /></div>
            <h3>Venta del día</h3>
            <p className='letter-1'>{`Productos: $${dailySales.products}`}</p>
            <p className='letter-1'>{`Reparaciones: $${dailySales.fixes}`}</p>
            <p className='letter-1'>{`Tiempo aire: $${dailySales.airtime}`}</p>
        </div>
    </>);
};

export default SalesByStore;
