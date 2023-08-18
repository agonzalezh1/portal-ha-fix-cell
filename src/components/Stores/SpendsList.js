
/**
 * Componente para mostrar la lista de gastos
 * @param {array} list Lista de gastos {description, amout}
 */
const SpendsList = ({list}) => {
    return(<div className='spends-list-container'>
        {list.map( (item, index) => <div key={index} className={'item'}>
            <p>{item.description}</p>
            <p className='bold numeric'>{`$${item.amount}.00`}</p>
        </div>)}
    </div>);
};

export default SpendsList;
