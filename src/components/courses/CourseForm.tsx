import * as React from 'react';
import TextInput from '../common/TextInput';
import SelectInput from '../common/SelectInput';

interface IProps {
  course: any;
  allAuthors: Array<any>;
  onSave?: any;
  onChange: any;
  loading?: boolean;
  errors: any;
}

const CourseForm = ({course, allAuthors, onSave, onChange, loading, errors}: IProps) => {
    return (
        <form>
            <h1>Manage Course</h1>
            <TextInput
                name="title"
                label="Title"
                value={course.title}
                onChange={onChange}
                error={errors.title} />
            <SelectInput
                name="authorId"
                label="Author"
                value={course.authorId}
                options={allAuthors}
                onChange={onChange}
                error={errors.authorId} />
            <TextInput
                name="category"
                label="Category"
                value={course.category}
                onChange={onChange}
                error={errors.category} />
            <TextInput
                name="length"
                label="Length"
                value={course.Length}
                onChange={onChange}
                error={errors.length} />
            <input 
                type="submit"
                disabled={loading}
                value={loading ? 'Saving...': 'Save'}
                className="btn btn-primary"
                onClick={onSave} />
        </form>
    );
};

// CourseForm.propTypes = {
//     course: PropTypes.object.isRequired,
//     allAuthors: PropTypes.array,
//     onSave: PropTypes.func.isRequired,
//     onChange: PropTypes.func.isRequired,
//     loading: PropTypes.bool.isRequired,
//     errors: PropTypes.object
// };

export default CourseForm;