import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
export default function Demo() {

    const [data, setData] = useState([])
    const [getId, setGetId] = useState('')

    
    useEffect(() => {
        axios.get('http://localhost:8080/get')
            .then((response) => {
                // handle success
                console.log(response.data.data);
                setData(response.data.data)
            })
            .catch((error) => {
                // handle error
                console.log(error);
            })

    }, [])
    const handleDelete = (id) => {

        axios.post('http://localhost:8080/as', { id: id })
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    
    const handleEdit = (alldata) => {
        formik.setValues({
            name: alldata.name,
            email: alldata.email,
        });
        setGetId(alldata._id)


    }

    const handleUpdate = () => {
        console.log(getId)

        axios.post('http://localhost:8080/update', {
            updatedData: {
                id: getId,
                name: formik.values.name,
                email: formik.values.email,
            },
        })
            .then((response) => {
                console.log(response);
                formik.resetForm()
            })
            .catch((error) => {
                console.log(error);
            });
    }
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        email: Yup.string().email('Invalid email address').required('Email is required'),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
        },
        validationSchema: validationSchema,
        onSubmit: (values, { setSubmitting }) => {
            // Prevent default form submission
            setSubmitting(true);

            // Handle form submission logic here
            axios.post('http://localhost:8080/add', values)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setSubmitting(false);
                });
            formik.resetForm()
        },
    });
    return (
        <div>
            <form onSubmit={formik.handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.name}
                    />
                    {formik.touched.name && formik.errors.name ? (
                        <div>{formik.errors.name}</div>
                    ) : null}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div>{formik.errors.email}</div>
                    ) : null}
                </div>

                <button type="submit">Submit</button>
            </form>
            <button onClick={handleUpdate} >Update</button>
            <>
                <table>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>id</th>
                        <th>Opation</th>
                    </tr>

                    {data.map((i) => {
                        return (
                            <tr>
                                <td>{i.name}</td>
                                <td>{i.email}</td>
                                <td>{i._id}</td>
                                <td><button onClick={() => handleDelete(i._id)}>Delete</button></td>
                                <td><button onClick={() => handleEdit(i)}>Edit</button></td>
                            </tr>
                        )
                    })}
                </table>
            </>

        </div>
    )
}
