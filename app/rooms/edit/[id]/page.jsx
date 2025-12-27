import Heading from "/components/Heading";
import getSingleRoom from "/app/actions/getSingleRoom"; 
import EditRoomForm from "/components/EditRoomForm";

const EditRoomPage = async ({ params }) => {
    const { id } = params;
    const room = await getSingleRoom(id);

    return (
        <>
            <Heading title="Edit room" />
            <EditRoomForm room={room} />
        </>
      
    );
};

export default EditRoomPage